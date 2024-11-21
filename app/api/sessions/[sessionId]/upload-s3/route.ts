import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@/utils/supabase/component";

const supabase = createClient();

const s3Client = new S3Client({
  region: process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
  },
});

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  let recordingId;
  try {
    recordingId = await createRecording(sessionId);
  } catch (dbError) {
    console.error("Database insert error:", dbError);
    return NextResponse.json(
      { error: "Database insert failed" },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const wavfile = formData.get("wavfile") as File;

    // 파일 내용을 ArrayBuffer로 변환 후 Buffer로 변환
    const arrayBuffer = await wavfile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadParams = {
      Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
      Key: `recordings/${recordingId}.wav`,
      Body: buffer,
      ContentType: "audio/wav",
    };

    // S3로 파일 업로드
    const command = new PutObjectCommand(uploadParams);
    try {
      await s3Client.send(command);
    } catch (s3Error) {
      console.error("S3 upload error:", s3Error);
      return NextResponse.json(
        { error: "File upload to S3 failed" },
        { status: 500 }
      );
    }

    const fileUrl = `https://${process.env.MY_AWS_S3_BUCKET_NAME}.s3.${process.env.MY_AWS_REGION}.amazonaws.com/recordings/${recordingId}.wav`;

    try {
      await updateRecordingUrl(recordingId, fileUrl);
    } catch (dbError) {
      console.error("Database update error:", dbError);
      return NextResponse.json(
        { error: "Database update failed", fileUrl: fileUrl },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "File uploaded and DB updated successfully",
      fileUrl: fileUrl,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}

// insert into Recording table
async function createRecording(sessionId) {
  const { data, error } = await supabase
    .from("Recording")
    .insert({
      session_id: sessionId,
      stt_status: "pending",
      topic_status: "pending",
    })
    .select("id");

  if (error) {
    throw new Error(`Error creating database record: ${error.message}`);
  }

  return data[0].id; // recordingId
}

// update recording s3_url
async function updateRecordingUrl(recordingId, fileUrl) {
  const { error } = await supabase
    .from("Recording")
    .update({
      s3_url: fileUrl,
      stt_status: "ready",
    })
    .eq("id", recordingId);

  if (error) {
    throw new Error(`Error updating database record: ${error.message}`);
  }
}

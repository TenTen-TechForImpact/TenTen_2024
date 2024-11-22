import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

const s3Client = new S3Client({
  region: process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  console.log("Session ID:", sessionId);

  try {
    const { fileUrl } = await req.json();
    console.log("File URL received:", fileUrl);

    if (!fileUrl) {
      console.error("File URL is missing");
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }

    // Insert a new recording and get the ID
    const recordingId = await createRecording(sessionId);
    console.log("Recording ID created:", recordingId);

    // Update the recording with the file URL
    const { error } = await supabase
      .from("Recording")
      .update({ s3_url: fileUrl, stt_status: "ready" })
      .eq("id", recordingId);

    if (error) {
      console.error("Database update error:", error);
      throw new Error(`Database update failed: ${error.message}`);
    }

    return NextResponse.json({ message: "Database updated successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function createRecording(sessionId: string): Promise<string> {
  const { data, error } = await supabase
    .from("Recording")
    .insert({
      session_id: sessionId,
      stt_status: "pending",
      topic_status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Database insert failed: ${error.message}`);
  }

  return data.id;
}

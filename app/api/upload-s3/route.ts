import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const config = {
  api: {
    bodyParser: false, // FormData 사용 시 bodyParser 비활성화
  },
};

export async function POST(req: NextRequest) {
  try {
    // req.body는 ReadableStream으로 되어 있기 때문에, 이를 Buffer로 변환해야 함
    const formData = await req.formData();

    const file = formData.get("file") as File;

    const arrayBuffer = await file.arrayBuffer(); // 파일 내용을 ArrayBuffer로 변환
    const buffer = Buffer.from(arrayBuffer);

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `recordings/${file.name}`,
      Body: buffer,
      ContentType: "audio/wav",
    };

    // S3로 파일 업로드
    const command = new PutObjectCommand(uploadParams);
    const data = await s3Client.send(command);

    return NextResponse.json({
      message: "File uploaded successfully",
      fileUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/uploads/${file.name}`,
    });
  } catch (error) {
    console.error("S3 upload error:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}

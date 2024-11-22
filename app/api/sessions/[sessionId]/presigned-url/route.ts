import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// S3 클라이언트 설정
const s3Client = new S3Client({
  region: process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  console.log("[DEBUG] Presigned URL generation initiated.");

  try {
    const { filename } = await req.json();
    console.log("[DEBUG] Received filename:", filename);

    if (!filename) {
      console.error("[ERROR] Filename is missing.");
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    // S3 업로드 설정
    const s3Params = {
      Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
      Key: `recordings/${filename}`,
      ContentType: "audio/wav",
    };

    console.log("[DEBUG] S3 Parameters for presigned URL:", s3Params);

    // Presigned URL 생성
    const command = new PutObjectCommand(s3Params);
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    console.log("[DEBUG] Generated presigned URL:", presignedUrl);

    return NextResponse.json({ url: presignedUrl });
  } catch (error) {
    console.error("[ERROR] Failed to generate presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}

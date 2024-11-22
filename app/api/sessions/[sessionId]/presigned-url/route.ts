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

  // Check environment variables
  console.log("[DEBUG] Environment variables:", {
    region: process.env.MY_AWS_REGION,
    bucketName: process.env.MY_AWS_S3_BUCKET_NAME,
  });

  try {
    // Parse request body
    let filename;
    try {
      const body = await req.json();
      console.log("[DEBUG] Parsed request body:", body);
      filename = body?.filename;
    } catch (error) {
      console.error("[ERROR] Failed to parse JSON body:", error);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Validate filename
    if (!filename) {
      console.error("[ERROR] Filename is missing in the request body.");
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    // Log S3 parameters
    const s3Params = {
      Bucket: process.env.MY_AWS_S3_BUCKET_NAME,
      Key: `recordings/${filename}`,
      ContentType: "audio/wav",
    };
    console.log("[DEBUG] S3 Parameters for presigned URL:", s3Params);

    // Generate Presigned URL
    const command = new PutObjectCommand(s3Params);
    try {
      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
      });

      if (!presignedUrl) {
        console.error(
          "[ERROR] Presigned URL generation failed. No URL returned."
        );
        throw new Error("Presigned URL generation failed.");
      }

      console.log("[DEBUG] Generated presigned URL:", presignedUrl);

      // Return the presigned URL
      return NextResponse.json({ url: presignedUrl });
    } catch (error) {
      console.error("[ERROR] Failed during Presigned URL generation:", error);
      throw error;
    }
  } catch (error) {
    console.error("[ERROR] Unexpected error occurred:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}

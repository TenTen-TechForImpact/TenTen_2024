import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import qs from "qs";
import fs from "fs";
import FormData from "form-data";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // FormData 사용 시 bodyParser 비활성화
  },
};

export async function POST(req: NextRequest) {
  try {
    const authToken = await getAuthToken();
    // const response = await getTranscription(authToken, req.body.toString());
    const filePath = path.join(process.cwd(), "public", "simulation1.wav");
    const response = await getTranscription(authToken, filePath);

    return NextResponse.json({
      message: "---- successfully",
      transcription: response,
    });
  } catch (error) {
    console.error("--- error:", error);
    return NextResponse.json({ error: "--- failed" }, { status: 500 });
  }
}

async function getAuthToken() {
  try {
    const response = await axios.post(
      "https://openapi.vito.ai/v1/authenticate",
      qs.stringify({
        // 데이터를 URL 인코딩해서 전송
        client_id: process.env.RETURNZERO_CLIENT_ID,
        client_secret: process.env.RETURNZERO_CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
      }
    );

    // 응답으로 받은 JWT 토큰 출력
    const token = response.data.access_token;
    return token;
  } catch (error) {
    console.error(
      "Error fetching token:",
      error.response ? error.response.data : error.message
    );
  }
}

async function getTranscription(auth_token, audioFilePath) {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(audioFilePath));
  formData.append(
    "config",
    JSON.stringify({
      model_name: "sommers", // 또는 'whisper'
      use_diarization: true,
      diarization: {
        spk_count: 2,
      },
    })
  );

  try {
    const response = await axios.post(
      "https://openapi.vito.ai/v1/transcribe",
      formData,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
          accept: "application/json",
          ...formData.getHeaders(),
        },
      }
    );
    const transcribeId = response.data.id;
    console.log("Transcription request sent:", transcribeId);

    // 전사 결과 조회
    await checkTranscriptionResult(auth_token, transcribeId);
  } catch (error) {
    console.error("Error during transcription request:", error);
  }
}

async function checkTranscriptionResult(auth_token, transcribeId) {
  try {
    // 일정 시간 대기 (예: 5초)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const response = await axios.get(
      `https://openapi.vito.ai/v1/transcribe/${transcribeId}`,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
          accept: "application/json",
        },
      }
    );

    if (response.data.status === "completed") {
      console.log("Transcription result:", response.data.results);
    } else if (response.data.status === "transcribing") {
      console.log("Transcription is still in progress. Retrying...");
      await checkTranscriptionResult(auth_token, transcribeId); // 재귀 호출로 재시도
    } else {
      console.error("Transcription failed:", response.data);
    }
  } catch (error) {
    console.error("Error retrieving transcription result:", error);
  }
}

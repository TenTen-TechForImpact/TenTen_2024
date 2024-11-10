import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";

// Supabase 클라이언트 생성
const supabase = createClient();

// Post: create new session card for a patient
export async function POST(
  req: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    // 요청 바디에서 JSON 데이터를 파싱
    const { session_datetime, title } = await req.json();
    const patientId = params.patientId;

    // 필수 데이터가 있는지 확인
    if (!session_datetime || !patientId) {
      return NextResponse.json(
        { error: "Required fields are missing or invalid patient ID" },
        { status: 400 }
      );
    }

    const sessionTitle = title || "Untitled Session";

    // Session 테이블에 데이터 삽입
    const { data, error } = await supabase
      .from("Session")
      .insert([
        {
          session_datetime: session_datetime,
          title: sessionTitle,
          patient_id: patientId,
          patient_summary: "", // 초기값 설정
        },
      ])
      .single(); // 삽입 후 단일 레코드 반환

    // 에러 처리
    if (error) {
      console.error("Error inserting session:", error.message);
      return NextResponse.json(
        { error: "Failed to insert session" },
        { status: 500 }
      );
    }

    // 성공적으로 삽입된 데이터 반환
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

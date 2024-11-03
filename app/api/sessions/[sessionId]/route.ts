import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/component";

// Supabase 클라이언트 생성
const supabase = createClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  // 세션 정보 조회
  console.log("Fetching session with ID:", sessionId);
  const { data: session, error } = await supabase
    .from("Session") // Session 테이블에서
    .select("*") // 필요한 모든 필드를 선택합니다.
    .eq("id", sessionId) // sessionId와 일치하는 항목을 가져옵니다.
    .single(); // 단일 레코드를 가져옵니다.

  // 에러 처리
  if (error) {
    console.error("Error fetching session:", error.message);
    if (error.message.includes("multiple rows")) {
      console.log("Multiple sessions found for this ID");
      return NextResponse.json(
        { error: "Multiple sessions found for this ID" },
        { status: 500 }
      );
    } else {
      console.log("Session not found");
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
  }

  // 조회된 세션 데이터를 JSON 형식으로 반환
  return NextResponse.json(session);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  // 요청에서 수정할 데이터 가져오기
  const updatedData = await req.json();

  // 세션 정보 수정
  console.log("Updating session with ID:", sessionId);
  const { data: session, error } = await supabase
    .from("Session") // Session 테이블에서
    .update(updatedData) // 업데이트할 데이터
    .eq("id", sessionId) // sessionId와 일치하는 항목을 업데이트합니다.
    .single(); // 단일 레코드를 반환합니다.

  // 에러 처리
  if (error) {
    console.error("Error updating session:", error.message);
    return NextResponse.json(
      { error: "Error updating session" },
      { status: 500 }
    );
  }

  // 수정된 세션 데이터를 JSON 형식으로 반환
  return NextResponse.json(session);
}

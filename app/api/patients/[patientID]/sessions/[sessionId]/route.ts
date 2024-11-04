import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";

// Supabase 클라이언트 생성
const supabase = createClient();

// DELETE: 특정 세션 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    );
  }

  // 세션 정보 삭제
  console.log("Deleting session with ID:", sessionId);
  const { error } = await supabase
    .from("Session") // Session 테이블에서
    .delete() // 데이터 삭제
    .eq("id", sessionId); // sessionId와 일치하는 항목을 삭제합니다.

  // 에러 처리
  if (error) {
    console.error("Error deleting session:", error.message);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }

  // 삭제 성공 응답 반환
  return NextResponse.json(
    { message: "Session deleted successfully" },
    { status: 200 }
  );
}

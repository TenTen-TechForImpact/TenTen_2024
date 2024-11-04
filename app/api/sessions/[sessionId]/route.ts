import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";

// Supabase 클라이언트 생성
const supabase = createClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  // temp 필드만 조회
  console.log("Fetching temp field for session with ID:", sessionId);
  const { data, error } = await supabase
    .from("Session")
    .select("temp")
    .eq("id", sessionId)
    .single();

  if (error) {
    console.error("Error fetching session:", error.message);
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  // 요청에서 업데이트할 데이터를 가져오기
  const updatedData = await req.json();

  // 기존 temp 데이터 가져오기
  const { data: currentData, error: fetchError } = await supabase
    .from("Session")
    .select("temp")
    .eq("id", sessionId)
    .single();

  if (fetchError) {
    console.error("Error fetching current temp data:", fetchError.message);
    return NextResponse.json(
      { error: "Error fetching current temp data" },
      { status: 500 }
    );
  }

  // 기존 데이터와 새 데이터를 병합
  const newTempData = { ...currentData?.temp, ...updatedData };

  // temp 필드 업데이트
  console.log("Updating temp field for session with ID:", sessionId);
  const { data, error } = await supabase
    .from("Session")
    .update({ temp: newTempData }) // 병합된 temp 데이터 업데이트
    .eq("id", sessionId)
    .single();

  if (error) {
    console.error("Error updating session:", error.message);
    return NextResponse.json(
      { error: "Error updating session" },
      { status: 500 }
    );
  }

  // 수정된 temp 데이터를 JSON 형식으로 반환
  return NextResponse.json(data);
}

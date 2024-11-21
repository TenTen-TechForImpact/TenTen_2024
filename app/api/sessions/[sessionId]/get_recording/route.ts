/*- **Endpoint**: `/api/sessions/{sessionId}/get_recording`
- **Description:** sessionId와 관련된 최신 녹음의 recordingId들을 가져온다.
- **Request Parameters**: 없음. url 파라미터
- **Response**:
- (recordId로 녹음 재생 가능하도록 권한 설정 되어있는지 확인 필요) */


import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";

const supabase = createClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;

  console.log("Fetching recording for session with ID:", sessionId);
  const { data, error } = await supabase
    .from("Recording")
    .select("id, s3_url, topic_status, stt_status, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })  // 최신 순으로 정렬.
    .limit(2); // 가장 최신 2개만.

  if (error) {
    console.error("Error fetching recording:", error.message);
    return NextResponse.json({ error: "Recording not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

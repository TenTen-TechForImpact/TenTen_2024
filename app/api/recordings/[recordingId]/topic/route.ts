import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";

const supabase = createClient();

export const runtime = "nodejs";

// POST: 주어진 recordingId에 대한 TopicSummary 데이터를 가져오기
export async function POST(
  req: NextRequest,
  { params }: { params: { recordingId: string } }
) {
  const { recordingId } = params;

  try {
    // 유효성 검사
    if (!recordingId) {
      return NextResponse.json(
        { error: "Recording ID is required" },
        { status: 400 }
      );
    }

    // Recording 테이블에서 topic_status 확인
    const { data: recording, error: recordingError } = await supabase
      .from("Recording")
      .select("topic_status")
      .eq("id", recordingId)
      .single();

    if (recordingError) {
      console.error("Supabase에서 Recording을 가져오는 중 오류:", recordingError);
      return NextResponse.json(
        { error: "Error fetching recording" },
        { status: 500 }
      );
    }

    // Recording이 없거나 topic_status가 "completed"가 아니면 오류 반환
    if (!recording || recording.topic_status !== "completed") {
      return NextResponse.json(
        { error: "Topic summary is not yet completed or recording not found" },
        { status: 400 }
      );
    }

    // 주어진 recordingId에 대한 TopicSummary 데이터를 가져옴
    const { data: topicSummaries, error: topicSummaryError } = await supabase
      .from("TopicSummary")
      .select("*") // Ensure that RLS policies allow this
      .eq("recording_id", recordingId);
  

    if (topicSummaryError) {
      console.error("Supabase에서 TopicSummary를 가져오는 중 오류:", topicSummaryError);
      return NextResponse.json(
        { error: "Error fetching topic summary" },
        { status: 500 }
      );
    }   
    // Check the recordingId being used
    console.log("Recording ID:", recordingId);

    // Check the data fetched from TopicSummary
    console.log("TopicSummaries:", topicSummaries);


    // TopicSummary 데이터가 없으면 오류 반환
    if (!topicSummaries || topicSummaries.length === 0) {
        return NextResponse.json(
          {
            error: `No topic summaries found for the given recording ID: ${recordingId}`,
            topicSummaries, 
          },
          { status: 404 }
        );
    }

    // TopicSummary 데이터를 반환
    return NextResponse.json({ topicSummaries });
  } catch (error) {
    console.error("Topic summary를 가져오는 중 오류:", error);
    return NextResponse.json(
      { error: "Error retrieving topic summary" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";

// Supabase 클라이언트 생성
const supabase = createClient();

// GET: get one patient
export async function GET(
  req: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const { patientId } = params;

    // 특정 환자 정보 조회
    const { data: patient, error } = await supabase
      .from("Patient") // Patient 테이블에서
      .select("*") // 필요한 모든 필드를 선택합니다.
      .eq("id", patientId) // patientId와 일치하는 항목을 가져옵니다.
      .single(); // 단일 레코드를 가져옵니다.

    // 에러 처리
    if (error) {
      console.error("Error fetching patient:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch patient" },
        { status: 404 }
      );
    }

    // 성공적으로 조회된 환자 데이터 반환
    return NextResponse.json(patient, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

// PUT: update patient information
export async function PUT(
  req: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const { patientId } = params;

    // 요청된 업데이트 데이터를 JSON으로 파싱
    const { name, date_of_birth, gender, phone_number, organization } =
      await req.json();

    // 업데이트할 필드가 하나 이상 있는지 확인
    if (!name && !date_of_birth && !gender && !phone_number && !organization) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    // 환자 정보를 업데이트
    const { data, error } = await supabase
      .from("Patient") // Patient 테이블에서
      .update({ name, date_of_birth, gender, phone_number, organization }) // 엄데이트할 데이터
      .eq("id", patientId) // patientId와 일치하는 항목을 업데이트합니다.
      .single(); // 단일 레코드를 가져옵니다.

    // 에러 처리
    if (error) {
      console.error("Error updating patient:", error.message);
      return NextResponse.json(
        { error: "Failed to update patient" },
        { status: 500 }
      );
    }

    // 업데이트된 환자 정보 반환
    return NextResponse.json(data, { status: 200 }); // 조회, 업데이트는 200
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

// DELETE: delete patient and related sessions by patientID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const { patientId } = params;

    // Patient 테이블에서 특정 ID의 환자 정보 삭제
    const { data, error: patientError } = await supabase
      .from("Patient") // Patient 테이블에서
      .delete()
      .eq("id", patientId); // "id" 필드와 patientId가 일치하는 레코드 삭제

    // 에러 처리
    if (patientError) {
      console.error("Error deleting patient:", patientError.message);
      return NextResponse.json(
        { error: "Failed to delete patient" },
        { status: 500 }
      );
    }

    // 환자 데이터가 없는 경우 (이미 삭제된 환자)
    if (data.length === 0) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // 환자 데이터 삭제 성공
    return NextResponse.json(
      { message: "Patient and related sessions deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

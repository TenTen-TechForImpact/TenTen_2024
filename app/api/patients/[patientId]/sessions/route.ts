import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/component";

// Supabase 클라이언트 생성
const supabase = createClient();

const defaultTemp = {
  personal_info: {
    name: "",
    date_of_birth: "",
    phone_number: "",
  },
  consultation_info: {
    insurance_type: "",
    initial_consult_date: "",
    current_consult_date: "",
    consult_session_number: "",
    pharmacist_names: ["", "", ""],
  },
  medical_conditions: {
    chronic_diseases: {
      disease_names: [],
      additional_info: "",
    },
    medical_history: "",
    symptoms: "",
    allergies: {
      has_allergies: "아니오",
      suspected_items: [],
    },
    adverse_drug_reactions: {
      has_adverse_drug_reactions: "아니오",
      suspected_medications: [],
      reaction_details: [],
    },
  },
  lifestyle: {
    smoking: {
      is_smoking: "아니오",
      duration_in_years: "",
      pack_per_day: "",
    },
    alcohol: {
      is_drinking: "아니오",
      drinks_per_week: "",
      amount_per_drink: "",
    },
    exercise: {
      is_exercising: "아니오",
      exercise_frequency: "",
      exercise_types: [],
    },
    diet: {
      is_balanced_meal: "아니오",
      balanced_meals_per_day: "",
    },
  },
  medication_management: {
    living_condition: {
      living_alone: "예",
      family_members: [],
      medication_assistants: [],
    },
    medication_storage: {
      has_medication_storage: "아니오",
      location: "",
    },
    prescription_storage: {
      is_prescription_stored: "아니오",
    },
  },
  questions: { list: [] },
  current_medications: {
    ethical_the_counter_drugs: { count: 0, list: [] },
    over_the_counter_drugs: { count: 0, list: [] },
    health_functional_foods: { count: 0, list: [] },
  },
  pharmacist_comments: "",
  care_note: "",
};

// Post: create new session card for a patient
export async function POST(
  req: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    // 요청 바디에서 JSON 데이터를 파싱
    const { "session-datetime": sessionDatetime } = await req.json();
    const patientId = params.patientId;

    // 필수 데이터가 있는지 확인
    if (!sessionDatetime || !patientId) {
      return NextResponse.json(
        { error: "Required fields are missing or invalid patient ID" },
        { status: 400 }
      );
    }

    // Patient 테이블에서 환자 정보 조회 (개인 정보 저장용)
    const { data: patient, error: patientError } = await supabase
      .from("Patient")
      .select("name, date_of_birth, phone_number")
      .eq("id", patientId)
      .single();

    if (patientError) {
      console.error("Error fetching patient:", patientError.message);
      return NextResponse.json(
        { error: "Failed to fetch patient data" },
        { status: 404 }
      );
    }

    // defaultTemp에 personal_info 업데이트
    const updatedTemp = {
      ...defaultTemp,
      personal_info: {
        name: patient.name,
        date_of_birth: patient.date_of_birth,
        phone_number: patient.phone_number,
      },
    };

    // Session 테이블에 데이터 삽입
    const { data: session, error: sessionError } = await supabase
      .from("Session")
      .insert([
        {
          session_datetime: sessionDatetime,
          patient_id: patientId,
          patient_summary: "",
          temp: updatedTemp,
        },
      ])
      .single(); // 삽입 후 단일 레코드 반환

    // 에러 처리
    if (sessionError) {
      console.error("Error inserting session:", sessionError.message);
      return NextResponse.json(
        { error: "Failed to insert session" },
        { status: 500 }
      );
    }

    // 성공적으로 삽입된 데이터 반환
    return NextResponse.json(session, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

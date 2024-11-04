import React from "react";
import styles from "./FirstSessionSummary.module.css";

interface FirstSessionSummaryProps {
  patientInfo: any;
  preQuestions: string[];
  sessionSummaryData: { topic_id: number; content: string }[];
}

const FirstSessionSummary: React.FC<FirstSessionSummaryProps> = ({
  patientInfo,
  preQuestions,
  sessionSummaryData,
}) => {
  return (
    <div className={styles.summaryContainer}>
      <h3 className={styles.title}>1차 상담 내용</h3>

      <div className={styles.section}>
        <h4>환자 상세 정보</h4>
        <p>
          <span className={styles.label}>질병 종류:</span>{" "}
          <span className={styles.value}>
            {Array.isArray(
              patientInfo.medical_conditions.chronic_diseases.disease_names
            ) &&
            patientInfo.medical_conditions.chronic_diseases.disease_names
              .length > 0
              ? patientInfo.medical_conditions.chronic_diseases.disease_names.join(
                  ", "
                )
              : "없음"}
          </span>
        </p>
        <p>
          <span className={styles.label}>기타:</span>{" "}
          <span className={styles.value}>
            {patientInfo.medical_conditions.chronic_diseases.additional_info ||
              "없음"}
          </span>
        </p>
        <p>
          <span className={styles.label}>과거 질병 및 수술 이력:</span>{" "}
          <span className={styles.value}>
            {patientInfo.medical_conditions.medical_history || "없음"}
          </span>
        </p>
        <p>
          <span className={styles.label}>주요 불편한 증상:</span>{" "}
          <span className={styles.value}>
            {patientInfo.medical_conditions.symptoms || "없음"}
          </span>
        </p>
        <p>
          <span className={styles.label}>알러지:</span>{" "}
          <span className={styles.value}>
            {patientInfo.medical_conditions.allergies.has_allergies === "예"
              ? `의심 항목: ${patientInfo.medical_conditions.allergies.suspected_items}`
              : "없음"}
          </span>
        </p>
        <p>
          <span className={styles.label}>약물 부작용:</span>{" "}
          <span className={styles.value}>
            {patientInfo.medical_conditions.adverse_drug_reactions
              .has_adverse_drug_reactions === "예"
              ? `의심 약물: ${patientInfo.medical_conditions.adverse_drug_reactions.suspected_medications} 증상: ${patientInfo.medical_conditions.adverse_drug_reactions.reaction_details}`
              : "없음"}
          </span>
        </p>
        <p>
          <span className={styles.label}>흡연:</span>{" "}
          <span className={styles.value}>
            {patientInfo.lifestyle.smoking.is_smoking === "예"
              ? `흡연 기간: ${patientInfo.lifestyle.smoking.duration_in_years}년, 평균 흡연량: ${patientInfo.lifestyle.smoking.pack_per_day}갑`
              : "비흡연"}
          </span>
        </p>
        <p>
          <span className={styles.label}>음주:</span>{" "}
          <span className={styles.value}>
            {patientInfo.lifestyle.alcohol.is_drinking === "예"
              ? `주 ${patientInfo.lifestyle.alcohol.drinks_per_week}회, 음주량: ${patientInfo.lifestyle.alcohol.amount_per_drink}`
              : "비음주"}
          </span>
        </p>
        <p>
          <span className={styles.label}>운동:</span>{" "}
          <span className={styles.value}>
            {patientInfo.lifestyle.exercise.is_exercising === "예"
              ? `${
                  patientInfo.lifestyle.exercise.exercise_frequency
                }, 운동 종류: ${
                  patientInfo.lifestyle.exercise.exercise_types
                    ? patientInfo.lifestyle.exercise.exercise_types
                    : "없음"
                }`
              : "운동 안 함"}
          </span>
        </p>
        <p>
          <span className={styles.label}>영양:</span>{" "}
          <span className={styles.value}>
            {patientInfo.lifestyle.diet.is_balanced_meal === "예"
              ? `균형 잡힌 식사 ${patientInfo.lifestyle.diet.balanced_meals_per_day}`
              : "불규칙한 식사"}
          </span>
        </p>
        <p>
          <span className={styles.label}>동거 가족 구성원:</span>{" "}
          <span className={styles.value}>
            {patientInfo.medication_management.living_condition.living_alone ===
            "예"
              ? "없음"
              : patientInfo.medication_management.living_condition
                  .family_members}
          </span>
        </p>
        <p>
          <span className={styles.label}>투약 보조자:</span>{" "}
          <span className={styles.value}>
            {
              patientInfo.medication_management.living_condition
                .medication_assistants
            }
          </span>
        </p>

        <p>
          <span className={styles.label}>약 보관 장소:</span>{" "}
          <span className={styles.value}>
            {patientInfo.medication_management.medication_storage
              .has_medication_storage === "예"
              ? `${
                  patientInfo.medication_management.medication_storage
                    .location || "없음"
                }`
              : "없음"}
          </span>
        </p>
        <p>
          <span className={styles.label}>처방전 보관 여부:</span>{" "}
          <span className={styles.value}>
            {patientInfo.medication_management.prescription_storage
              .is_prescription_stored === "예"
              ? "보관"
              : "미보관"}
          </span>
        </p>
      </div>

      <div className={styles.section}>
        <h4>상담 전 질문</h4>
        {Array.isArray(preQuestions) && preQuestions.length > 0 ? (
          preQuestions.map((question, index) => <p key={index}>{question}</p>)
        ) : (
          <p>질문 없음</p>
        )}
      </div>

      <div className={styles.section}>
        <h4>상담 전 질문 음성 요약</h4>
        {Array.isArray(sessionSummaryData) && sessionSummaryData.length > 0 ? (
          sessionSummaryData.map((item) => (
            <p key={item.topic_id}>{item.content}</p>
          ))
        ) : (
          <p>요약된 질문 없음</p>
        )}
      </div>
    </div>
  );
};

export default FirstSessionSummary;

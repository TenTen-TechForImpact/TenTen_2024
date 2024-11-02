// src/components/Sidebar/FirstSessionSummary.tsx
import React from "react";
import styles from "./FirstSessionSummary.module.css";

interface FirstSessionSummaryProps {
  patientInfo: any;
  preQuestions: string[];
}

const FirstSessionSummary: React.FC<FirstSessionSummaryProps> = ({
  patientInfo,
  preQuestions,
}) => {
  console.log("FirstSessionSummary patientInfo:", patientInfo);
  console.log(
    "FirstSessionSummary patientInfo.diseases:",
    patientInfo.diseases
  );

  return (
    <div className={styles.summaryContainer}>
      <h3 className={styles.title}>1차 상담 내용</h3>
      <div className={styles.section}>
        <h4>환자 상세 정보</h4>
        <p>
          질병 종류:{" "}
          {Array.isArray(patientInfo.diseases) &&
          patientInfo.diseases.length > 0
            ? patientInfo.diseases.join(", ")
            : "없음"}
        </p>
        <p>
          흡연:{" "}
          {patientInfo.smoking?.status === "예"
            ? `흡연 기간: ${patientInfo.smoking.duration}년, 평균 흡연량: ${patientInfo.smoking.packsPerDay}갑`
            : "비흡연"}
        </p>
        <p>
          음주:{" "}
          {patientInfo.drinking?.status === "예"
            ? `음주 횟수: ${patientInfo.drinking.frequencyPerWeek}회/주, 1회 음주량: ${patientInfo.drinking.amountPerSession}병`
            : "비음주"}
        </p>
        <p>
          운동:{" "}
          {patientInfo.exercise?.status === "예"
            ? `운동 횟수: ${patientInfo.exercise.selectedOption}, 운동 종류: ${
                Array.isArray(patientInfo.exercise.exerciseType) &&
                patientInfo.exercise.exerciseType.length > 0
                  ? patientInfo.exercise.exerciseType.join(", ")
                  : "없음"
              }`
            : "운동 안 함"}
        </p>
        <p>
          영양:{" "}
          {patientInfo.diet?.status === "예"
            ? `균형 잡힌 식사: 하루 ${patientInfo.diet.selectedOption}회`
            : "불규칙한 식사"}
        </p>
        <p>
          독거 여부:{" "}
          {patientInfo.livingCondition?.status === "아니오"
            ? `동거 가족 구성원: ${
                patientInfo.livingCondition.familyMembers || "없음"
              }`
            : "독거"}
        </p>
        <p>
          투약 보조자:{" "}
          {patientInfo.medicationAssistants?.selectedOption === "기타"
            ? `기타: ${patientInfo.medicationAssistants.otherText || "없음"}`
            : patientInfo.medicationAssistants?.selectedOption}
        </p>
        <p>
          약 보관 장소:{" "}
          {patientInfo.medicationStorage?.status === "예"
            ? `보관 장소: ${patientInfo.medicationStorage.location || "없음"}`
            : "보관 장소 없음"}
        </p>
        <p>
          처방전 보관 여부:{" "}
          {patientInfo.prescriptionStorage === "예" ? "보관" : "미보관"}
        </p>
        <p>
          알러지:{" "}
          {patientInfo.allergies?.status === "예"
            ? `알레르기 항목: ${patientInfo.allergies.suspectedItem || "없음"}`
            : "알러지 없음"}
        </p>
        <p>
          약물 부작용:{" "}
          {patientInfo.adverseDrugReactions?.status === "예"
            ? `의심 약물: ${
                patientInfo.adverseDrugReactions.suspectedMedication || "없음"
              }, 증상: ${
                patientInfo.adverseDrugReactions.reactionDetail || "없음"
              }`
            : "약물 부작용 없음"}
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
    </div>
  );
};

export default FirstSessionSummary;

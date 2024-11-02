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
            {Array.isArray(patientInfo.diseases) &&
            patientInfo.diseases.length > 0
              ? patientInfo.diseases.join(", ")
              : "없음"}
          </span>
        </p>
        <p>
          <span className={styles.label}>흡연:</span>{" "}
          <span className={styles.value}>
            {patientInfo.smoking?.status === "예"
              ? `흡연 기간: ${patientInfo.smoking.duration}년, 평균 흡연량: ${patientInfo.smoking.packsPerDay}갑`
              : "비흡연"}
          </span>
        </p>
        <p>
          <span className={styles.label}>음주:</span>{" "}
          <span className={styles.value}>
            {patientInfo.drinking?.status === "예"
              ? `음주 횟수: ${patientInfo.drinking.frequencyPerWeek}회/주, 1회 음주량: ${patientInfo.drinking.amountPerSession}병`
              : "비음주"}
          </span>
        </p>
        <p>
          <span className={styles.label}>운동:</span>{" "}
          <span className={styles.value}>
            {patientInfo.exercise?.status === "예"
              ? `운동 횟수: ${
                  patientInfo.exercise.selectedOption
                }, 운동 종류: ${
                  Array.isArray(patientInfo.exercise.exerciseType) &&
                  patientInfo.exercise.exerciseType.length > 0
                    ? patientInfo.exercise.exerciseType.join(", ")
                    : "없음"
                }`
              : "운동 안 함"}
          </span>
        </p>
        <p>
          <span className={styles.label}>영양:</span>{" "}
          <span className={styles.value}>
            {patientInfo.diet?.status === "예"
              ? `균형 잡힌 식사: 하루 ${patientInfo.diet.selectedOption}회`
              : "불규칙한 식사"}
          </span>
        </p>
        <p>
          <span className={styles.label}>독거 여부:</span>{" "}
          <span className={styles.value}>
            {patientInfo.livingCondition?.status === "아니오"
              ? `동거 가족 구성원: ${
                  patientInfo.livingCondition.familyMembers || "없음"
                }`
              : "독거"}
          </span>
        </p>
        <p>
          <span className={styles.label}>투약 보조자:</span>{" "}
          <span className={styles.value}>
            {patientInfo.medicationAssistants?.selectedOption === "기타"
              ? `기타: ${patientInfo.medicationAssistants.otherText || "없음"}`
              : patientInfo.medicationAssistants?.selectedOption}
          </span>
        </p>
        <p>
          <span className={styles.label}>약 보관 장소:</span>{" "}
          <span className={styles.value}>
            {patientInfo.medicationStorage?.status === "예"
              ? `보관 장소: ${patientInfo.medicationStorage.location || "없음"}`
              : "보관 장소 없음"}
          </span>
        </p>
        <p>
          <span className={styles.label}>처방전 보관 여부:</span>{" "}
          <span className={styles.value}>
            {patientInfo.prescriptionStorage === "예" ? "보관" : "미보관"}
          </span>
        </p>
        <p>
          <span className={styles.label}>알러지:</span>{" "}
          <span className={styles.value}>
            {patientInfo.allergies?.status === "예"
              ? `알레르기 항목: ${
                  patientInfo.allergies.suspectedItem || "없음"
                }`
              : "알러지 없음"}
          </span>
        </p>
        <p>
          <span className={styles.label}>약물 부작용:</span>{" "}
          <span className={styles.value}>
            {patientInfo.adverseDrugReactions?.status === "예"
              ? `의심 약물: ${
                  patientInfo.adverseDrugReactions.suspectedMedication || "없음"
                }, 증상: ${
                  patientInfo.adverseDrugReactions.reactionDetail || "없음"
                }`
              : "약물 부작용 없음"}
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

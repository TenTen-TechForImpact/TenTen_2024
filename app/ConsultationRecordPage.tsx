// src/app/ConsultationRecordPage.tsx
"use client";

import { useState } from "react";
import NavigationList from "../components/Sidebar/NavigationList";
import MainContent from "../components/MainContent/MainContent";
import FirstSessionSummary from "../components/Sidebar/FirstSessionSummary";
import Header from "../components/Header/Header";
import styles from "./ConsultationRecordPage.module.css";

// Helper function to summarize patient info
const summarizePatientInfo = (info: any) => {
  return {
    disease:
      Array.isArray(info.disease) && info.disease.length > 0
        ? info.disease.join(", ")
        : "없음",
    smokingStatus:
      info.smoking.status === "예"
        ? `흡연 기간: ${info.smoking.duration || "N/A"}년, 평균 흡연량: ${
            info.smoking.packsPerDay || "N/A"
          }갑`
        : "비흡연",
    alcoholStatus:
      info.drinking.status === "예"
        ? `음주 횟수: ${
            info.drinking.frequencyPerWeek || "N/A"
          }회/주, 1회 음주량: ${info.drinking.amountPerSession || "N/A"}병`
        : "비음주",
    exercise:
      info.exercise.status === "예"
        ? `운동 횟수: ${info.exercise.selectedOption || "N/A"}, 운동 종류: ${
            info.exercise.exerciseType?.join(", ") || "N/A"
          }`
        : "운동 안 함",
    diet:
      info.diet.status === "예"
        ? `균형 잡힌 식사: 하루 ${info.diet.selectedOption || "N/A"}회`
        : "불규칙한 식사",
    livingCondition:
      info.livingCondition.status === "아니오"
        ? `동거 가족 구성원: ${info.livingCondition.familyMembers || "N/A"}`
        : "독거",
    medicationAssistants:
      info.medicationAssistants.selectedOption === "기타"
        ? `기타: ${info.medicationAssistants.otherText || "N/A"}`
        : info.medicationAssistants.selectedOption || "N/A",
    medicationStorage:
      info.medicationStorage.status === "예"
        ? `보관 장소: ${info.medicationStorage.location || "N/A"}`
        : "보관 장소 없음",
    prescriptionStorage: info.prescriptionStorage === "예" ? "보관" : "미보관",
    allergies: info.allergies.hasAllergies
      ? `알레르기 항목: ${info.allergies.suspectedItems?.join(", ") || "N/A"}`
      : "알러지 없음",
    adverseDrugReactions: info.adverseDrugReactions.hasAdverseDrugReactions
      ? `의심 약물: ${
          info.adverseDrugReactions.suspectedMedications?.join(", ") || "N/A"
        }, 증상: ${
          info.adverseDrugReactions.reactionDetails?.join(", ") || "N/A"
        }`
      : "약물 부작용 없음",
  };
};

const ConsultationRecordPage: React.FC = () => {
  // 상담 데이터 상태 관리
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    birthDate: "",
    contact: "",
    date: "",
    pharmacistName: "",
    diseases: [], // 배열로 초기화
    additionalDiseaseInfo: "",
    allergies: { status: "아니오", suspectedItem: "" },
    adverseDrugReactions: {
      status: "아니오",
      suspectedMedication: "",
      reactionDetail: "",
    },
    smoking: { status: "아니오", duration: "", packsPerDay: "" },
    drinking: { status: "아니오", frequencyPerWeek: "", amountPerSession: "" },
    exercise: { status: "아니오", selectedOption: "", exerciseType: [] }, // 배열로 초기화
    diet: { status: "아니오", selectedOption: "" },
    livingCondition: { status: "예", familyMembers: "" },
    medicationAssistants: { selectedOption: "본인", otherText: "" },
    medicationStorage: { status: "아니오", location: "" },
    prescriptionStorage: "아니오",
  });

  const [preQuestions, setPreQuestions] = useState<string[]>([]);

  // Sample data for session summary
  const [sessionSummaryData, setSessionSummaryData] = useState([
    {
      topic_id: 1,
      start_time: "0분 0초",
      end_time: "1분 50초",
      content: "Q. 당뇨약을 줄이는 게 현실적인가요?",
      related_scripts: [
        {
          time: "1분 24초",
          content:
            "그래서 사실 당뇨약을 줄이는 게 제일 현실적인 것 같아요. 이게 뭔가? 그래서 그만큼 지금 이 약을.",
        },
      ],
    },
    // Add more items as needed
  ]);

  const handleCompleteFirstSession = () => {
    if (patientInfo.birthDate && preQuestions.length > 0) {
      setIsFollowUp(true);
    } else {
      alert("모든 정보를 입력해주세요.");
    }
  };

  const handleRecordingStatusChange = (recordingStatus: boolean) => {
    setIsRecording(recordingStatus);
  };

  // Summarize patientInfo for FirstSessionSummary
  const summarizedPatientInfo = summarizePatientInfo(patientInfo);

  return (
    <div className={styles.consultationRecordPage}>
      <Header />
      <div className={styles.contentWrapper}>
        <aside className={styles.sidebar}>
          <NavigationList isFollowUp={isFollowUp} isRecording={isRecording} />
        </aside>
        <main className={styles.mainContent}>
          <MainContent
            isFollowUp={isFollowUp}
            onCompleteFirstSession={handleCompleteFirstSession}
            onRecordingStatusChange={handleRecordingStatusChange}
            patientInfo={patientInfo}
            setPatientInfo={setPatientInfo}
            preQuestions={preQuestions}
            setPreQuestions={setPreQuestions}
          />
        </main>
        {isFollowUp && (
          <aside className={styles.rightSidebar}>
            <FirstSessionSummary
              patientInfo={patientInfo}
              preQuestions={preQuestions}
            />
          </aside>
        )}
      </div>
    </div>
  );
};

export default ConsultationRecordPage;

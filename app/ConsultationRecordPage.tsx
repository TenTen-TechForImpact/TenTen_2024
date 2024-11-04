"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import NavigationList from "../components/Sidebar/NavigationList";
import MainContent from "../components/MainContent/MainContent";
import FirstSessionSummary from "../components/Sidebar/FirstSessionSummary";
import Header from "../components/Header/Header";
import styles from "./ConsultationRecordPage.module.css";

const ConsultationRecordPage: React.FC = () => {
  // 상담 데이터 상태 관리
  const [activeTab, setActiveTab] = useState<"firstSession" | "followUp">(
    "firstSession"
  );
  const [isFirstSessionCompleted, setIsFirstSessionCompleted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const pathname = usePathname();
  const sessionId = pathname.split("/").pop();

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
  const [sessionSummaryData, setSessionSummaryData] = useState([
    {
      topic_id: 1,
      content: "Q. 당뇨약을 줄이는 게 현실적인가요?",
    },
    {
      topic_id: 2,
      content: "Q. 운동 계획을 어떻게 세우는 게 좋을까요?",
    },
  ]);

  const handleRecordingStatusChange = (recordingStatus: boolean) => {
    setIsRecording(recordingStatus);
  };

  const handleCompleteFirstSession = () => {
    setIsFirstSessionCompleted(true);
    setActiveTab("followUp");
  };

  const handleTabChange = (tab: "firstSession" | "followUp") => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.consultationRecordPage}>
      <Header />
      <div className={styles.contentWrapper}>
        <aside className={styles.sidebar}>
          <NavigationList
            activeTab={activeTab}
            isRecording={isRecording}
            isFirstSessionCompleted={isFirstSessionCompleted}
            onTabChange={handleTabChange}
          />
        </aside>
        <main className={styles.mainContent}>
          <MainContent
            isFollowUp={activeTab === "followUp"}
            onCompleteFirstSession={handleCompleteFirstSession}
            onRecordingStatusChange={handleRecordingStatusChange}
            patientInfo={patientInfo}
            setPatientInfo={setPatientInfo}
            preQuestions={preQuestions}
            setPreQuestions={setPreQuestions}
            sessionId={sessionId}
          />
        </main>
        {isFirstSessionCompleted && (
          <aside className={styles.rightSidebar}>
            <FirstSessionSummary
              patientInfo={patientInfo}
              preQuestions={preQuestions}
              sessionSummaryData={sessionSummaryData}
            />
          </aside>
        )}
      </div>
    </div>
  );
};

export default ConsultationRecordPage;

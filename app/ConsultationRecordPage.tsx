"use client";

import { useState } from "react";
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
  const [patientInfo, setPatientInfo] = useState({
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
  });

  const [preQuestions, setPreQuestions] = useState<string[]>([]);
  const [sessionSummaryData, setSessionSummaryData] = useState([
    // Sample data for 1차 상담의 음성 요약
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
    // 1차 상담이 완료되었을 때 상태 업데이트
    setIsFirstSessionCompleted(true);
    setActiveTab("followUp"); // 자동으로 2차 상담으로 전환. 나중에는 그냥 patient 페이지로 나가는 식으로?
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

// src/app/ConsultationRecordPage.tsx
"use client";

import React, { useState } from 'react';
import NavigationList from '../components/Sidebar/NavigationList';
import MainContent from '../components/MainContent/MainContent';
import FirstSessionSummary from '../components/Sidebar/FirstSessionSummary';
import Header from '../components/Header/Header';
import SummaryBar from '../components/SummaryBar/ConsultationSummaryBar'; // Import SummaryBar
import styles from './ConsultationRecordPage.module.css';

const ConsultationRecordPage: React.FC = () => {
  // 상담 데이터 상태 관리
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSummaryBar, setShowSummaryBar] = useState(false); // New state for SummaryBar visibility
  const [patientInfo, setPatientInfo] = useState({
    birthDate: "",
    disease: "",
    smokingStatus: "",
    alcoholStatus: "",
    exercise: "",
    diet: "",
  });
  const [preQuestions, setPreQuestions] = useState<string[]>([]);

  // Sample data for session summary
  const [sessionSummaryData, setSessionSummaryData] = useState([
    {
      topic_id: 1,
      start_time: '0분 0초',
      end_time: '1분 50초',
      content: 'Q. 당뇨약을 줄이는 게 현실적인가요?',
      related_scripts: [
        {
          time: '1분 24초',
          content: '그래서 사실 당뇨약을 줄이는 게 제일 현실적인 것 같아요. 이게 뭔가? 그래서 그만큼 지금 이 약을.',
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

  const handlePreQuestionsFocus = () => {
    setShowSummaryBar(true); // Show SummaryBar when entering pre-questions
  };

  const handlePreQuestionsBlur = () => {
    setShowSummaryBar(false); // Hide SummaryBar when leaving pre-questions
  };

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
            onPreQuestionsFocus={handlePreQuestionsFocus} // Pass focus handler
            onPreQuestionsBlur={handlePreQuestionsBlur}   // Pass blur handler
          />
          {showSummaryBar && (
            <SummaryBar data={sessionSummaryData} />
          )}
        </main>
        {isFollowUp && (
          <aside className={styles.rightSidebar}>
            <FirstSessionSummary patientInfo={patientInfo} preQuestions={preQuestions} />
          </aside>
        )}
      </div>
    </div>
  );
};

export default ConsultationRecordPage;

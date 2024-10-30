// src/app/ConsultationRecordPage.tsx
"use client";

import React, { useState } from 'react';
import NavigationList from '../components/Sidebar/NavigationList';
import MainContent from '../components/MainContent/MainContent';
import FirstSessionSummary from '../components/Sidebar/FirstSessionSummary';
import Header from '../components/Header/Header';
import styles from './ConsultationRecordPage.module.css';

const ConsultationRecordPage: React.FC = () => {
  // 상담 데이터 상태 관리
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    birthDate: "",
    disease: "",
    smokingStatus: "",
    alcoholStatus: "",
    exercise: "",
    diet: "",
  });
  const [preQuestions, setPreQuestions] = useState<string[]>([]);

  const handleCompleteFirstSession = () => {
    // 사용자가 입력한 데이터가 유효한지 확인
    if (patientInfo.birthDate && preQuestions.length > 0) {
      setIsFollowUp(true);
    } else {
      alert("모든 정보를 입력해주세요.");
    }
  };

  return (
    <div className={styles.consultationRecordPage}>
      <Header />
      <div className={styles.contentWrapper}>
        <aside className={styles.sidebar}>
          <NavigationList isFollowUp={isFollowUp} />
        </aside>
        <main className={styles.mainContent}>
          <MainContent
            isFollowUp={isFollowUp}
            onCompleteFirstSession={handleCompleteFirstSession}
            patientInfo={patientInfo}
            setPatientInfo={setPatientInfo}
            preQuestions={preQuestions}
            setPreQuestions={setPreQuestions}
          />
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

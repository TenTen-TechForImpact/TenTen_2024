// src/components/Sidebar/FirstSessionSummary.tsx
import React from 'react';
import styles from './FirstSessionSummary.module.css';

interface FirstSessionSummaryProps {
  patientInfo: {
    birthDate: string;
    disease: string;
    smokingStatus: string;
    alcoholStatus: string;
    exercise: string;
    diet: string;
  };
  preQuestions: string[];
}

const FirstSessionSummary: React.FC<FirstSessionSummaryProps> = ({ patientInfo, preQuestions }) => {
  return (
    <div className={styles.summaryContainer}>
      <h3 className={styles.title}>1차 상담 내용</h3>
      <div className={styles.section}>
        <h4>환자 상세 정보</h4>
        <p>생년월일 : {patientInfo.birthDate}</p>
        <p>질병 : {patientInfo.disease}</p>
        <p>흡연 : {patientInfo.smokingStatus}</p>
        <p>음주 : {patientInfo.alcoholStatus}</p>
        <p>운동 : {patientInfo.exercise}</p>
        <p>영양 : {patientInfo.diet}</p>
      </div>
      <div className={styles.section}>
        <h4>상담 전 질문</h4>
        {preQuestions.map((question, index) => (
          <p key={index}>{question}</p>
        ))}
      </div>
    </div>
  );
};

export default FirstSessionSummary;

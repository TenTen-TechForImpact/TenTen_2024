// src/components/Sidebar/ConsultationSummary.tsx
import React from 'react';
import styles from './ConsultationSummary.module.css';

const ConsultationSummary: React.FC = () => {
  return (
    <div className={styles.consultationSummary}>
      <h3>1차 상담 요약</h3>
      <p>환자 질문 및 상담 내용 요약...</p>
    </div>
  );
};

export default ConsultationSummary;

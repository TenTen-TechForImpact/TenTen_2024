// src/components/Sidebar/PatientInfoCard.tsx
import React from 'react';
import styles from './PatientInfoCard.module.css';

const PatientInfoCard: React.FC = () => {
  return (
    <div className={styles.patientInfoCard}>
      <h2>환자 정보</h2>
      <p>이름: 홍길동</p>
      <p>성별: 남성</p>
      <p>나이: 30</p>
    </div>
  );
};

export default PatientInfoCard;

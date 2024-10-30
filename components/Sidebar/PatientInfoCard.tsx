// src/components/Sidebar/PatientInfoCard.tsx
import React from 'react';
import styles from './PatientInfoCard.module.css';
import Image from 'next/image'; // Next.js의 Image 컴포넌트를 사용

interface PatientInfo {
  id: number;
  name: string;
  gender: string;
  birthDate: string;
  phoneNumber: string;
}

interface PatientInfoCardProps {
  patientInfo: PatientInfo;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ patientInfo }) => {
  const { name, gender, birthDate } = patientInfo;

  return (
    <div className={styles.patientInfoCard}>
      <div className={styles.infoHeader}>
        <Image
          src="/images/old_woman_color_light.svg"
          alt="환자 아이콘"
          width={40}
          height={40}
          className={styles.patientIcon}
        />
        <div className={styles.patientText}>
          <p className={styles.patientName}>
            <span className={styles.name}>{name}</span>
            <span className={styles.patientLabel}> 환자</span>
          </p>
          <p className={styles.patientDetails}>
            {gender === "Male" ? "남" : "여"} | {birthDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoCard;

import React from "react";
import styles from "./PatientProfile.module.css";

interface Patient {
  id: string;
  name: string;
  date_of_birth: Date;
  gender: string;
  phone_number: string;
  organization: string;
  created_at: Date;
  modified_at: Date;
}

interface PatientProfileProps {
  patient: Patient;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ patient }) => {
  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.profileHeader}>환자 정보</h2>
      <div className={styles.profileDetails}>
        <div className={styles.profileRow}>
          <span className={styles.label}>이름:</span>
          <span className={styles.value}>{patient.name}</span>
        </div>
        <div className={styles.profileRow}>
          <span className={styles.label}>생년월일:</span>
          <span className={styles.value}>
            {patient.date_of_birth.toISOString().split("T")[0]}
          </span>
        </div>
        <div className={styles.profileRow}>
          <span className={styles.label}>성별:</span>
          <span className={styles.value}>{patient.gender}</span>
        </div>
        <div className={styles.profileRow}>
          <span className={styles.label}>전화번호:</span>
          <span className={styles.value}>{patient.phone_number}</span>
        </div>
        <div className={styles.profileRow}>
          <span className={styles.label}>소속:</span>
          <span className={styles.value}>{patient.organization}</span>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;

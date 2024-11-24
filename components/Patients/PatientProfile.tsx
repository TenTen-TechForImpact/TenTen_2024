import React from "react";
import styles from "./PatientProfile.module.css";
import { FaPhone, FaBirthdayCake, FaVenusMars, FaBuilding, FaFileAlt, FaSms, FaHistory } from "react-icons/fa";

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
      <div className={styles.imageContainer}>
        <img
          src="/images/old_woman_color_light.svg"
          className={styles.profileImage}
          alt="환자 프로필 이미지"
        />
      </div>
      <div className={styles.profileInfo}>
        <h2 className={styles.profileName}>{patient.name}</h2>
        <p className={styles.profilePhone}>
          <FaPhone className={styles.icon} />
          {patient.phone_number}
        </p>
        <div className={styles.profileDetailsRow}>
          <div className={styles.profileDetail}>
            <FaBirthdayCake className={styles.icon} />
            {patient.date_of_birth.toISOString().split("T")[0]}
          </div>
          <div className={styles.profileDetail}>
            <FaVenusMars className={styles.icon} />
            {patient.gender}
          </div>
          <div className={styles.profileDetail}>
            <FaBuilding className={styles.icon} />
            {patient.organization}
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.actionButton}>
          <FaFileAlt className={styles.buttonIcon} />
          한글 출력
        </button>
        <button className={styles.actionButton}>
          <FaSms className={styles.buttonIcon} />
          문자 전송
        </button>
        <button className={styles.actionButton}>
          <FaHistory className={styles.buttonIcon} />
          히스토리
        </button>
      </div>
    </div>
  );
};

export default PatientProfile;

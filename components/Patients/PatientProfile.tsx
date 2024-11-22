import React from "react";
import styles from "./PatientProfile.module.css";
import { FaPhone, FaBirthdayCake, FaVenusMars, FaBuilding } from "react-icons/fa";

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
    </div>
  );
};

export default PatientProfile;

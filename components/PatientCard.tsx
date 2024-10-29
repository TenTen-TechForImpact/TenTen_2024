import React from "react";
import ActionButton from "./ActionButton";
import styles from "./PatientCard.module.css";

interface PatientProps {
  name: string;
  age: number;
  gender: string;
}

const PatientCard: React.FC<PatientProps> = ({ name, age, gender }) => (
  <div className={styles.patientCard}>
    <div className={styles.avatarContainer}>
      <img
        src="/images/old_woman_color_light.svg"
        alt="Avatar"
        className={styles.avatar}
      />
    </div>
    <div className={styles.patientInfo}>
      <div className={styles.patientName}>
        <img
          src="/images/ic_fluent_person_24_filled.svg"
          alt="Person Icon"
          className={styles.icon}
        />
        <span>{name}</span>
      </div>
      <div className={styles.patientDetails}>
        <img
          src="/images/ic_fluent_info_24_regular.svg"
          alt="Info Icon"
          className={styles.icon}
        />
        <span>{`만 ${age}세 | ${gender}`}</span>
      </div>
      <ActionButton
        text="상세 내용 보기"
        onClick={() => console.log("View Details")}
        width={192}
        height={50}
        fontSize={24}
      />
    </div>
  </div>
);

export default PatientCard;

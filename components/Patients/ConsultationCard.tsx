import React from "react";
import { useRouter } from "next/navigation";
import ActionButton from "../ActionButton";
import styles from "./PatientCard.module.css";

interface PatientProps {
  id: number; // ID 추가
  name: string;
  age: number;
  gender: string;
  phoneNumber: string; // 전화번호 추가
  organization: string; // 소속 추가
}

const PatientCard: React.FC<PatientProps> = ({
  id,
  name,
  age,
  gender,
  phoneNumber,
  organization,
}) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/patients/${id}`);
  };

  return (
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
          <span>{name}</span>
          <span className={styles.phoneIcon}>
            <img
              src="/images/phone_icon.svg" // 전화 아이콘 경로
              alt="전화 아이콘"
              className={styles.icon}
              title={phoneNumber} // hover 시 전화번호 표시
            />
          </span>
        </div>
        <div className={styles.patientDetails}>
          <span>{`만 ${age}세 | ${gender}`}</span>
        </div>
        <div className={styles.patientOrganization}>
          <span>{organization}</span> {/* 소속 표시 */}
        </div>
        <ActionButton
          text="상세 내용 보기"
          onClick={handleViewDetails}
          width={192}
          height={50}
          fontSize={24}
        />
      </div>
    </div>
  );
};

export default PatientCard;

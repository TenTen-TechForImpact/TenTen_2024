"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ActionButton from "../ActionButton";
import DeleteModal from "../DeleteModal";
import styles from "./PatientCard.module.css";

interface PatientProps {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone_number: string;
  organization: string;
  onDelete: (id: string) => void;
  onEdit: (patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
    phone_number: string;
    organization: string;
  }) => void;
}

const PatientCard: React.FC<PatientProps> = ({
  id,
  name,
  age,
  gender,
  organization,
  phone_number,
  onDelete,
  onEdit,
}) => {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleViewDetails = () => {
    router.push(`/patients/${id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(id);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleEditClick = () => {
    onEdit({ id, name, age, gender, phone_number, organization });
  };

  // 아바타 필요 시 아래 코드 사용
  /* <div className={styles.avatarContainer}>
        <img
          src="/images/old_woman_color_light.svg"
          alt="Avatar"
          className={styles.avatar}
        />
      </div>*/
  return (
    <div className={styles.patientCard}>
      <div className={styles.deleteButtonContainer}>
        <button className={styles.editButton} onClick={handleEditClick}>
          🖊️
        </button>
        <button className={styles.deleteButton} onClick={handleDeleteClick}>
          🗑️
        </button>
      </div>
      <div className={styles.patientInfo}>
        <div className={styles.patientName}>
          <img
            src="/images/ic_fluent_person_24_filled.svg"
            alt=""
            className={styles.icon}
          />
          <span>{name}</span>
          <div className={styles.phoneIconContainer}>
            <img
              src="/images/ic_fluent_call_24_filled.svg"
              alt="Phone Icon"
              className={styles.icon}
            />
            <div className={styles.phoneTooltip}>{phone_number}</div>
          </div>
        </div>
        <div className={styles.patientDetails}>
          <img
            src="/images/ic_fluent_info_24_regular.svg"
            alt=""
            className={styles.icon}
          />
          <span>{`${age}세 | ${gender}`}</span>
        </div>
        <div className={styles.patientDetails}>
          <img
            src="/images/ic_fluent_building_24_filled.svg"
            alt=""
            className={styles.icon}
          />
          <span>{organization}</span>
        </div>
        <ActionButton
          text="상담 목록 보기"
          onClick={handleViewDetails}
          width={192}
          height={50}
          fontSize={24}
        />
      </div>

      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          deleteName="환자 카드"
        />
      )}
    </div>
  );
};

export default PatientCard;

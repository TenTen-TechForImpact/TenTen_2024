"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ActionButton from "../ActionButton";
import DeleteModal from "../DeleteModal";
import styles from "./PatientCard.module.css";

interface PatientProps {
  id: number;
  name: string;
  age: number;
  gender: string;
  onDelete: (id: number) => void; // 삭제 함수
}

const PatientCard: React.FC<PatientProps> = ({
  id,
  name,
  age,
  gender,
  onDelete,
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

  return (
    <div className={styles.patientCard}>
      <div className={styles.deleteButtonContainer}>
        <button className={styles.deleteButton} onClick={handleDeleteClick}>
          X
        </button>
      </div>
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
            alt=""
            className={styles.icon}
          />
          <span>{name}</span>
        </div>
        <div className={styles.patientDetails}>
          <img
            src="/images/ic_fluent_info_24_regular.svg"
            alt=""
            className={styles.icon}
          />
          <span>{`만 ${age}세 | ${gender}`}</span>
        </div>
        <ActionButton
          text="상세 내용 보기"
          onClick={handleViewDetails}
          width={192}
          height={50}
          fontSize={24}
        />
      </div>

      {showDeleteModal && (
        <DeleteModal
          message="삭제하시겠습니까?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default PatientCard;

"use client";

import React, { useState } from "react";
import ActionButton from "../ActionButton";
import DeleteModal from "../DeleteModal"; // Import the DeleteModal component
import styles from "./SessionCard.module.css";

interface SessionCardProps {
  id: string;
  dateTime: string;
  onViewDetails: () => void;
  onDelete: (id: string) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  id,
  dateTime,
  onViewDetails,
  onDelete,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  // Extract the date in the format YYYY-MM-DD
  const date = new Date(dateTime).toISOString().split("T")[0];

  return (
    <div className={styles.sessionCard}>
      <div className={styles.deleteButtonContainer}>
        <button className={styles.deleteButton} onClick={handleDeleteClick}>
          X
        </button>
      </div>
      <div className={styles.cardHeader}>
        <span>상담 날짜: {date}</span>
      </div>
      <div className={styles.buttonContainer}>
        <ActionButton
          text="상담 내용 보기"
          onClick={onViewDetails}
          width={250}
          height={50}
          fontSize={16}
        />
        <ActionButton
          text="저장하기"
          onClick={() => {}}
          width={250}
          height={50}
          fontSize={16}
        />
      </div>

      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          deleteName="상담 카드"
        />
      )}
    </div>
  );
};

export default SessionCard;

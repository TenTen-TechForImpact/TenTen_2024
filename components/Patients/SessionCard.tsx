// SessionCard.tsx

import React, { useState } from "react";
import ActionButton from "../ActionButton";
import DeleteModal from "../DeleteModal";
import styles from "./SessionCard.module.css";

interface SessionCardProps {
  id: string;
  dateTime: Date;
  modifiedDateTime: Date;
  title: string;
  onViewDetails: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  id,
  dateTime,
  modifiedDateTime,
  title,
  onViewDetails,
  onDelete,
  onEdit,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const formattedDateTime = dateTime.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedModifiedDateTime = modifiedDateTime.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className={styles.sessionCard}>
      <div className={styles.deleteButtonContainer}>
        <button className={styles.editButton} onClick={onEdit}>
          🖊️
        </button>
        <button className={styles.deleteButton} onClick={handleDeleteClick}>
          🗑️
        </button>
      </div>
      <div className={styles.cardContent}>
        <p className={styles.cardText}>상담일: {formattedDateTime}</p>
        <p className={styles.cardText}>수정일: {formattedModifiedDateTime}</p>
        <p className={styles.cardText}>제목: {title}</p>
      </div>
      <div className={styles.actionButtonContainer}>
        <ActionButton
          text="상담 내용 보기"
          onClick={onViewDetails}
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

// SessionCard.tsx

import React, { useState } from "react";
import styles from "./SessionCard.module.css";

interface Session {
  id: string;
  patient_id: string;
  session_datetime: Date;
  title: string;
  status: string | null;
  pharmacist_summary: string | null;
  patient_summary: string | null;
  form_type: string | null;
  form_content: string | null;
  created_at: Date;
  modified_at: Date;
  former_questions: string | null;
  prescription_drugs: string | null;
  other_drugs: string | null;
  pharmacist_note: string | null;
  temp: string | null;
}


interface SessionCardProps {
  session: Session;
  onViewDetails: (session: Session) => void;
  onDelete: (session: Session) => void;
  onEdit: (session: Session) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onViewDetails,
  onDelete,
  onEdit,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDeleteClick = () => {
    onDelete(session);
    setShowDropdown(false);
  };

  const handleEditClick = () => {
    onEdit(session);
    setShowDropdown(false);
  };

  const handleViewDetailsClick = () => {
    onViewDetails(session);
    setShowDropdown(false);
  }

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const formattedDateTime = session.session_datetime.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedModifiedDateTime = session.modified_at.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className={styles.sessionContainer}>
      <div className={styles.sessionRow}>
        <div className={styles.sessionField}>{session.title}</div>
        <div className={styles.sessionField}>{formattedDateTime}</div>
        <div className={styles.sessionField}>{formattedModifiedDateTime}</div>
        <button className={styles.actionButton} onClick={toggleDropdown}>
          ⋮
        </button>
        {showDropdown && (
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownItem} onClick={handleEditClick}>
              수정
            </div>
            <div className={styles.dropdownItem} onClick={handleDeleteClick}>
              삭제
            </div>
            <div className={styles.dropdownItem} onClick={handleViewDetailsClick}>
              상담 보기
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCard;

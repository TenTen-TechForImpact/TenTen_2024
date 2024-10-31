import React from "react";
import styles from "./SessionCard.module.css";

interface SessionCardProps {
  date: string;
  onViewDetails: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ date, onViewDetails }) => {
  return (
    <div className={styles.sessionCard}>
      <div className={styles.cardHeader}>
        <span>{date}</span>
      </div>
      <button className={styles.viewButton} onClick={onViewDetails}>
        상담 내용 보기
      </button>
      <button className={styles.saveButton}>저장하기</button>
    </div>
  );
};

export default SessionCard;

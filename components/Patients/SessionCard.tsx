import React from "react";
import ActionButton from "../ActionButton";
import styles from "./SessionCard.module.css";

interface SessionCardProps {
  date: string;
  onViewDetails: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ date, onViewDetails }) => {
  return (
    <div className={styles.sessionCard}>
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
    </div>
  );
};

export default SessionCard;

// src/components/MainContent/CareNotesSection.tsx
import React, { useState } from 'react';
import { FaPencilAlt, FaSave } from 'react-icons/fa';
import styles from './CareNotesSection.module.css';

const CareNotesSection: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [careNotes, setCareNotes] = useState("돌봄 노트를 입력하세요.");

  const handleIconClick = () => {
    if (isEditing) {
      console.log("저장되었습니다.");
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className={styles.section}>
      <div className={styles.titleContainer}>
        <h3>돌봄 노트</h3>
        <button className={styles.iconButton} onClick={handleIconClick}>
          {isEditing ? <FaSave /> : <FaPencilAlt />}
        </button>
      </div>
      <div className={styles.content}>
        {isEditing ? (
          <textarea
            value={careNotes}
            onChange={(e) => setCareNotes(e.target.value)}
            className={styles.textarea}
          />
        ) : (
          <p className={styles.text}>{careNotes}</p>
        )}
      </div>
    </div>
  );
};

export default CareNotesSection;

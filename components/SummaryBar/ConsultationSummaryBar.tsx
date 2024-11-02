// src/components/SummaryBar/ConsultationSummaryBar.tsx

import React, { useState } from 'react';
import styles from './ConsultationSummaryBar.module.css';

interface RelatedScript {
  time: string;
  content: string;
}

interface SessionSummaryItem {
  topic_id: number;
  start_time: string;
  end_time: string;
  content: string;
  related_scripts: RelatedScript[];
}

interface ConsultationSummaryBarProps {
  sessionSummary: SessionSummaryItem[];
  onAddToPreQuestions: (content: string) => void;
}

const ConsultationSummaryBar: React.FC<ConsultationSummaryBarProps> = ({
  sessionSummary,
  onAddToPreQuestions,
}) => {
  return (
    <div className={styles.summaryBar}>
      <h2 className={styles.title}>텐텐이 요약한 상담 내용</h2>
      {sessionSummary.map((item, index) => (
        <SummaryItem key={index} item={item} onAddToPreQuestions={onAddToPreQuestions} />
      ))}
    </div>
  );
};

const SummaryItem: React.FC<{ item: SessionSummaryItem; onAddToPreQuestions: (content: string) => void }> = ({ item, onAddToPreQuestions }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddClick = () => {
    onAddToPreQuestions(item.content);
  };

  return (
    <div className={styles.summaryItem}>
      <div className={styles.summaryContent}>
        <p>{item.content}</p>
        <button onClick={toggleExpand} className={styles.expandButton}>
          {isExpanded ? '▲' : '▼'}
        </button>
        <button onClick={handleAddClick} className={styles.addButton}>추가</button>
      </div>
      {isExpanded && (
        <div className={styles.relatedScripts}>
          {item.related_scripts.map((script, index) => (
            <div key={index} className={styles.scriptItem}>
              <p><strong>{script.time}:</strong> {script.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultationSummaryBar;

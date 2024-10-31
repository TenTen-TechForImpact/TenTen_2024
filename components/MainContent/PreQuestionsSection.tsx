// src/components/MainContent/PreQuestionsSection.tsx
import React, { useState } from 'react';
import styles from './PreQuestionsSection.module.css';

interface PreQuestionsSectionProps {
  preQuestions: string[];
  setPreQuestions: React.Dispatch<React.SetStateAction<string[]>>;
}

const PreQuestionsSection: React.FC<PreQuestionsSectionProps> = ({ preQuestions, setPreQuestions }) => {
  const [newQuestion, setNewQuestion] = useState("");

  const handleAddQuestion = () => {
    if (newQuestion.trim() !== "") {
      setPreQuestions([...preQuestions, newQuestion]);
      setNewQuestion(""); // 입력창 초기화
    }
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = preQuestions.filter((_, i) => i !== index);
    setPreQuestions(updatedQuestions);
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>상담 전 질문</h3>
      <ul className={styles.questionList}>
        {preQuestions.map((question, index) => (
          <li key={index} className={styles.questionItem}>
            {question}
            <button
              className={styles.deleteButton}
              onClick={() => handleDeleteQuestion(index)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
      <textarea
        className={styles.textarea}
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        placeholder="질문을 입력하세요"
      />
      <button className={styles.saveButton} onClick={handleAddQuestion}>
        저장하기
      </button>
    </div>
  );
};

export default PreQuestionsSection;

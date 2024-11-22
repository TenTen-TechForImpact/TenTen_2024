import React, { useState, useEffect } from "react";
import styles from "./PreQuestionsSection.module.css";

interface PreQuestions {
  questions?: {
    list: string[];
  };
}

interface PreQuestionsSectionProps {
  preQuestions: PreQuestions;
  setPreQuestions: React.Dispatch<React.SetStateAction<PreQuestions>>;
  sessionId: string;
}

const PreQuestionsSection: React.FC<PreQuestionsSectionProps> = ({
  preQuestions,
  setPreQuestions,
  sessionId,
}) => {
  const [newQuestion, setNewQuestion] = useState("");

  const updateQuestionsOnServer = async (updatedQuestions: string[]) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions: { list: updatedQuestions } }),
      });

      if (!response.ok) {
        throw new Error("Failed to update questions");
      }
      console.log("Questions updated successfully");
    } catch (error) {
      console.error("Error updating questions:", error);
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() !== "") {
      const currentList = preQuestions.questions?.list || []; // 안전한 접근
      if (currentList.includes(newQuestion.trim())) {
        alert("이미 존재하는 질문입니다.");
        setNewQuestion("");
        return;
      }
      const updatedQuestions = [...currentList, newQuestion];
      setPreQuestions({ questions: { list: updatedQuestions } });
      setNewQuestion(""); // 입력창 초기화
      updateQuestionsOnServer(updatedQuestions);
    }
  };

  const handleDeleteQuestion = (index: number) => {
    const currentList = preQuestions.questions?.list || [];
    const updatedQuestions = currentList.filter((_, i) => i !== index);
    setPreQuestions({ questions: { list: updatedQuestions } });
    updateQuestionsOnServer(updatedQuestions);
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>상담 전 질문</h3>
      <ul className={styles.questionList}>
        {preQuestions.questions?.list.map((question, index) => (
          <li key={question} className={styles.questionItem}>
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

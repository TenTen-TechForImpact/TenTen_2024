import React from "react";
import { useState } from "react";
import ConsultationSummaryBar from "../SummaryBar/ConsultationSummaryBar";
import styles from "./PharmacistInterventionSection.module.css";

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

type Topics = SessionSummaryItem[];

interface PharmacistInterventionSectionProps {
  pharmacistIntervention: any;
  setPharmacistIntervention: React.Dispatch<React.SetStateAction<any>>;
  sessionId: string;
  onAddContent: (content: string) => void;
  topics: Topics;
  pharmacistComment: string;
  setPharmacistComment: React.Dispatch<React.SetStateAction<string>>;
}

const PharmacistInterventionSection: React.FC<
  PharmacistInterventionSectionProps
> = ({
  pharmacistIntervention,
  setPharmacistIntervention,
  sessionId,
  pharmacistComment,
  setPharmacistComment,
  onAddContent,
  topics,
}) => {
  const updateCommentsOnServer = async (updatedComments: string[]) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pharmacist_comments: updatedComments }),
      });

      if (!response.ok) {
        throw new Error("Failed to update pharmacist comments");
      }
      console.log("Pharmacist comments updated successfully");
    } catch (error) {
      console.error("Error updating pharmacist comments:", error);
    }
  };

  const handleAddComment = () => {
    if (pharmacistComment.trim() !== "") {
      const currentComments = pharmacistIntervention.pharmacist_comments || [];
      if (currentComments.includes(pharmacistComment.trim())) {
        alert("이미 존재하는 중재 내용입니다.");
        setPharmacistComment("");
        return;
      }
      const updatedComments = [...currentComments, pharmacistComment];
      setPharmacistIntervention({ pharmacist_comments: updatedComments });
      setPharmacistComment(""); // 입력창 초기화
      updateCommentsOnServer(updatedComments);
    }
  };

  const handleDeleteComment = (index: number) => {
    const currentComments = pharmacistIntervention.pharmacist_comments || [];
    const updatedComments = currentComments.filter((_, i) => i !== index);
    setPharmacistIntervention({ pharmacist_comments: updatedComments });
    updateCommentsOnServer(updatedComments);
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>약사 중재 내용</h3>
      <ul className={styles.interventionList}>
        {pharmacistIntervention.pharmacist_comments.map((comment, index) => (
          <li key={index} className={styles.interventionItem}>
            <span>{comment}</span>
            <button
              className={styles.deleteButton}
              onClick={() => {
                const updatedComments = [
                  ...pharmacistIntervention.pharmacist_comments,
                ];
                updatedComments.splice(index, 1);
                setPharmacistIntervention({
                  pharmacist_comments: updatedComments,
                });
              }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
      <textarea
        className={styles.textarea}
        value={pharmacistComment}
        onChange={(e) => setPharmacistComment(e.target.value)}
        placeholder="약사 중재 내용을 입력하세요."
      />
      <button className={styles.addButton} onClick={handleAddComment}>
        추가하기
      </button>
      {/* <ConsultationSummaryBar
        sessionSummary={
          topics
            ? topics
            : [
                {
                  topic_id: 1,
                  start_time: "0분 0초",
                  end_time: "1분 50초",
                  content: "미구현 상태입니다.",
                  related_scripts: [
                    {
                      time: "1분 24초",
                      content:
                        "그래서 사실 당뇨약을 줄이는 게 제일 현실적인 것 같아요.",
                    },
                    {
                      time: "1분 38초",
                      content:
                        "줄이시는 게 발생한 문제를 해소하는 데 큰 도움이 될 거거든요.",
                    },
                  ],
                },
              ]
        }
        onAddContent={(content) => {
          setPharmacistIntervention({
            pharmacist_comments: `${pharmacistIntervention.pharmacist_comments}\n${content}`,
          });
          onAddContent(content);
        }}
      /> */}
    </div>
  );
};

export default PharmacistInterventionSection;

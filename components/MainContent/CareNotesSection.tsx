import React from "react";
import ConsultationSummaryBar from "../SummaryBar/ConsultationSummaryBar"; // Summary Bar 임포트
import styles from "./CareNotesSection.module.css";

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

interface CareNotesSectionProps {
  careNote: any;
  setCareNote: React.Dispatch<React.SetStateAction<any>>;
  sessionId: string;
  onAddContent: (content: string) => void;
  topics: Topics;
}

const CareNotesSection: React.FC<CareNotesSectionProps> = ({
  careNote,
  setCareNote,
  sessionId,
  onAddContent,
  topics,
}) => {
  const handleBlur = () => {
    const updatedField = { care_note: careNote.care_note };
    console.log("Care Note 저장됨:", JSON.stringify(updatedField));

    // Server PATCH request
    fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedField),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data updated successfully:", data);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>돌봄 노트</h3>
      <textarea
        value={careNote.care_note}
        onChange={(e) => setCareNote({ care_note: e.target.value })}
        onBlur={handleBlur} // Save notes on blur
        className={styles.textarea}
        placeholder="돌봄 노트를 입력하세요."
      />
      <ConsultationSummaryBar
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
          setCareNote({
            care_note: `${careNote.care_notes}\n${content}`,
          });
          onAddContent(content);
        }}
      />
    </div>
  );
};

export default CareNotesSection;

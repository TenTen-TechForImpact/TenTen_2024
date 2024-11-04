import React from "react";
import ConsultationSummaryBar from "../SummaryBar/ConsultationSummaryBar"; // Summary Bar 임포트
import styles from "./CareNotesSection.module.css";

interface CareNotesSectionProps {
  careNote: any;
  setCareNote: React.Dispatch<React.SetStateAction<any>>;
  sessionId: string;
  onAddContent: (content: string) => void;
}

const CareNotesSection: React.FC<CareNotesSectionProps> = ({
  careNote,
  setCareNote,
  sessionId,
  onAddContent,
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
        sessionSummary={[
          {
            topic_id: 1,
            start_time: "0분 0초",
            end_time: "1분 50초",
            content: "미구현 상태입니다.",
            related_scripts: [
              {
                time: "1분 24초",
                content: "일단은 주간에 햇빛을 쐬고 운동을 많이 해주셔야 돼요",
              },
              {
                time: "1분 34초",
                content: "햇빛이 생체시계를 깨우는 역할을 하거든요.",
              },
            ],
          },
        ]}
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

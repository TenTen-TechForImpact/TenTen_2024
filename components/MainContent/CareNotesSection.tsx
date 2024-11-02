import React, { useState } from "react";
import ConsultationSummaryBar from "../SummaryBar/ConsultationSummaryBar"; // Summary Bar 임포트
import styles from "./CareNotesSection.module.css";

interface CareNotesSectionProps {
  onAddContent: (content: string) => void;
}

const CareNotesSection: React.FC<CareNotesSectionProps> = ({
  onAddContent,
}) => {
  const [careNotes, setCareNotes] = useState("");
  const sessionSummaryData = [
    {
      topic_id: 1,
      start_time: "0분 0초",
      end_time: "1분 50초",
      content: "Q. 당뇨약을 줄이는 게 현실적인가요?",
      related_scripts: [
        {
          time: "1분 24초",
          content: "그래서 사실 당뇨약을 줄이는 게 제일 현실적인 것 같아요.",
        },
      ],
    },
  ];

  const handleBlur = () => {
    // 저장 로직 (예: 서버로 전송하거나 콘솔에 출력)
    console.log("Care Notes 저장됨:", careNotes);
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>돌봄 노트</h3>
      <textarea
        value={careNotes}
        onChange={(e) => setCareNotes(e.target.value)}
        onBlur={handleBlur} // focus가 빠질 때 저장
        className={styles.textarea}
        placeholder="돌봄 노트를 입력하세요."
      />
      <ConsultationSummaryBar
        sessionSummary={sessionSummaryData}
        onAddContent={(content) => {
          setCareNotes((prev) => `${prev}\n${content}`);
          onAddContent(content);
        }}
      />
    </div>
  );
};

export default CareNotesSection;

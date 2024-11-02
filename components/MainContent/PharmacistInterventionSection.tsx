import React, { useState } from "react";
import ConsultationSummaryBar from "../SummaryBar/ConsultationSummaryBar"; // Summary Bar 임포트
import styles from "./PharmacistInterventionSection.module.css";

interface PharmacistInterventionSectionProps {
  onAddContent: (content: string) => void;
}

const PharmacistInterventionSection: React.FC<
  PharmacistInterventionSectionProps
> = ({ onAddContent }) => {
  const [interventionNotes, setInterventionNotes] = useState("");
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
        {
          time: "1분 24초",
          content: "그래서 사실 당뇨약을 줄이는 게 제일 현실적인 것 같아요.",
        },
        {
          time: "1분 24초",
          content: "그래서 사실 당뇨약을 줄이는 게 제일 현실적인 것 같아요.",
        },
      ],
    },
  ];

  const handleBlur = () => {
    // 저장 로직 (예: 서버로 전송하거나 콘솔에 출력)
    console.log("약사 중재 내용 저장됨:", interventionNotes);
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>약사 중재 내용</h3>
      <textarea
        value={interventionNotes}
        onChange={(e) => setInterventionNotes(e.target.value)}
        onBlur={handleBlur} // focus가 빠질 때 저장
        className={styles.textarea}
        placeholder="약사 중재 내용을 입력하세요."
      />
      <ConsultationSummaryBar
        sessionSummary={sessionSummaryData}
        onAddContent={(content) => {
          setInterventionNotes((prev) => `${prev}\n${content}`);
          onAddContent(content);
        }}
      />
    </div>
  );
};

export default PharmacistInterventionSection;

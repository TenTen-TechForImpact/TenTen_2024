import React from "react";
import ConsultationSummaryBar from "../SummaryBar/ConsultationSummaryBar";
import styles from "./PharmacistInterventionSection.module.css";

interface PharmacistInterventionSectionProps {
  pharmacistIntervention: any;
  setPharmacistIntervention: React.Dispatch<React.SetStateAction<any>>;
  sessionId: string;
  onAddContent: (content: string) => void;
}

const PharmacistInterventionSection: React.FC<
  PharmacistInterventionSectionProps
> = ({
  pharmacistIntervention,
  setPharmacistIntervention,
  sessionId,
  onAddContent,
}) => {
  const handleBlur = () => {
    const updatedField = {
      pharmacist_comments: pharmacistIntervention.pharmacist_comments,
    };
    console.log("Field updated:", JSON.stringify(updatedField));

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
      <h3 className={styles.title}>약사 중재 내용</h3>
      <textarea
        value={pharmacistIntervention.pharmacist_comments}
        onChange={(e) =>
          setPharmacistIntervention({
            ...pharmacistIntervention,
            pharmacist_comments: e.target.value,
          })
        }
        onBlur={handleBlur} // Save notes on blur only
        className={styles.textarea}
        placeholder="약사 중재 내용을 입력하세요."
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
        ]}
        onAddContent={(content) => {
          setPharmacistIntervention({
            pharmacist_comments: `${pharmacistIntervention.pharmacist_comments}\n${content}`,
          });
          onAddContent(content);
        }}
      />
    </div>
  );
};

export default PharmacistInterventionSection;

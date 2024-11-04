"use client"

import React from "react";
import PersonalInfoSection from "./PersonalInfoSection";
import PreQuestionsSection from "./PreQuestionsSection";
import PrescriptionDrugsSection from "./PrescriptionDrugsSection";
import OTCAndSupplementsSection from "./OTCAndSupplementsSection";
import CareNotesSection from "./CareNotesSection";
import PharmacistInterventionSection from "./PharmacistInterventionSection";
import RecordingSection from "./RecordingSection";
import styles from "./MainContent.module.css";

interface MainContentProps {
  isFollowUp: boolean;
  onCompleteFirstSession: () => void;
  onRecordingStatusChange: (isRecording: boolean) => void;
  patientInfo: any;
  setPatientInfo: React.Dispatch<React.SetStateAction<any>>;
  preQuestions: string[];
  setPreQuestions: React.Dispatch<React.SetStateAction<string[]>>;
  sessionId: string | null;
}

const MainContent: React.FC<MainContentProps> = ({
  isFollowUp,
  onCompleteFirstSession,
  onRecordingStatusChange,
  patientInfo,
  setPatientInfo,
  preQuestions,
  setPreQuestions,
  sessionId,
}) => {
  const handleAddContent = (content: string) => {
    console.log("추가된 content:", content);
  };

  return (
    <div className={styles.mainContent}>
      {!isFollowUp && (
        <>
          <section id="patientInfo" className={styles.section}>
            <PersonalInfoSection
              patientInfo={patientInfo}
              setPatientInfo={setPatientInfo}
            />
          </section>
          <section id="preQuestions" className={styles.section}>
            <PreQuestionsSection
              preQuestions={preQuestions}
              setPreQuestions={setPreQuestions}
            />
          </section>
          <section id="prescriptionDrugs" className={styles.section}>
            <PrescriptionDrugsSection />
          </section>
          <section id="otcAndSupplements" className={styles.section}>
            <OTCAndSupplementsSection />
          </section>
          <button
            className={styles.completeButton}
            onClick={onCompleteFirstSession}
          >
            1차 상담 완료
          </button>
        </>
      )}

      {isFollowUp && (
        <>
          <section id="recording" className={styles.section}>
            <RecordingSection
              onRecordingStatusChange={onRecordingStatusChange}
              sessionId={sessionId ?? "임시ID"}
            />
          </section>
          <section id="prescriptionDrugs" className={styles.section}>
            <PrescriptionDrugsSection />
          </section>
          <section id="otcAndSupplements" className={styles.section}>
            <OTCAndSupplementsSection />
          </section>
          <section id="pharmacistIntervention" className={styles.section}>
            <PharmacistInterventionSection onAddContent={handleAddContent} />
          </section>
          <section id="careNotes" className={styles.section}>
            <CareNotesSection onAddContent={handleAddContent} />
          </section>
        </>
      )}
    </div>
  );
};

export default MainContent;

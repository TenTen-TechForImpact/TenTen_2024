// src/components/MainContent/MainContent.tsx

"use client";

import React from 'react';
import PersonalInfoSection from './PersonalInfoSection';
import PreQuestionsSection from './PreQuestionsSection';
import PrescriptionDrugsSection from './PrescriptionDrugsSection';
import OTCAndSupplementsSection from './OTCAndSupplementsSection';
import PharmacistInterventionSection from './PharmacistInterventionSection';
import CareNotesSection from './CareNotesSection';
import RecordingSection from './RecordingSection'; // 녹음 섹션 추가
import styles from './MainContent.module.css';

interface MainContentProps {
  isFollowUp: boolean;
  onCompleteFirstSession: () => void;
  onRecordingStatusChange: (isRecording: boolean) => void; // 녹음 상태 변경 함수
  patientInfo: any;
  setPatientInfo: React.Dispatch<React.SetStateAction<any>>;
  preQuestions: string[];
  setPreQuestions: React.Dispatch<React.SetStateAction<string[]>>;
}

const MainContent: React.FC<MainContentProps> = ({
  isFollowUp,
  onCompleteFirstSession,
  onRecordingStatusChange, // 녹음 상태 변경 함수
  patientInfo,
  setPatientInfo,
  preQuestions,
  setPreQuestions,
}) => {
  return (
    <div className={styles.mainContent}>
      <section id="recording" className={styles.section}>
        {/* onRecordingStatusChange 전달 */}
        <RecordingSection onRecordingStatusChange={onRecordingStatusChange} />
      </section>

      {!isFollowUp && (
        <>
          <section id="patientInfo" className={styles.section}>
            <PersonalInfoSection patientInfo={patientInfo} setPatientInfo={setPatientInfo} />
          </section>
          <section id="preQuestions" className={styles.section}>
            <PreQuestionsSection preQuestions={preQuestions} setPreQuestions={setPreQuestions} />
          </section>
          <section id="prescriptionDrugs" className={styles.section}>
            <PrescriptionDrugsSection />
          </section>
          <section id="otcAndSupplements" className={styles.section}>
            <OTCAndSupplementsSection />
          </section>
          <button className={styles.completeButton} onClick={onCompleteFirstSession}>
            1차 상담 완료
          </button>
        </>
      )}

      {isFollowUp && (
        <>
          <section id="prescriptionDrugs" className={styles.section}>
            <PrescriptionDrugsSection />
          </section>
          <section id="otcAndSupplements" className={styles.section}>
            <OTCAndSupplementsSection />
          </section>
          <section id="pharmacistIntervention" className={styles.section}>
            <PharmacistInterventionSection />
          </section>
          <section id="careNotes" className={styles.section}>
            <CareNotesSection />
          </section>
        </>
      )}
    </div>
  );
};

export default MainContent;

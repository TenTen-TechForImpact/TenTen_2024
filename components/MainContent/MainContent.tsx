// src/components/MainContent/MainContent.tsx
"use client";

import React from 'react';
import PersonalInfoSection from './PersonalInfoSection';
import PreQuestionsSection from './PreQuestionsSection';
import PrescriptionDrugsSection from './PrescriptionDrugsSection';
import OTCAndSupplementsSection from './OTCAndSupplementsSection';
import PharmacistInterventionSection from './PharmacistInterventionSection';
import CareNotesSection from './CareNotesSection';
import styles from './MainContent.module.css';

interface MainContentProps {
  isFollowUp: boolean;
  onCompleteFirstSession: () => void;
  patientInfo: any;
  setPatientInfo: React.Dispatch<React.SetStateAction<any>>;
  preQuestions: string[];
  setPreQuestions: React.Dispatch<React.SetStateAction<string[]>>;
}

const MainContent: React.FC<MainContentProps> = ({
  isFollowUp,
  onCompleteFirstSession,
  patientInfo,
  setPatientInfo,
  preQuestions,
  setPreQuestions,
}) => {
  return (
    <div className={styles.mainContent}>
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
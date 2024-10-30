// app/ConsultationRecordPage.tsx
"use client";

import React from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import MainContent from "../components/MainContent/MainContent";
import styles from "./ConsultationRecordPage.module.css";

const ConsultationRecordPage: React.FC<{ isFollowUp: boolean }> = ({ isFollowUp }) => {
  return (
    <div className={styles.consultationRecordPage}>
      <Header />
      <div className={styles.layout}>
        <Sidebar isFollowUp={isFollowUp} />
        <main className={styles.mainContent}>
          <MainContent isFollowUp={isFollowUp} />
        </main>
      </div>
    </div>
  );
};

export default ConsultationRecordPage;

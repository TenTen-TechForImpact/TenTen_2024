// src/components/Sidebar/NavigationList.tsx
"use client";

import React, { useState } from "react";
import { FaPencilAlt, FaMicrophone } from "react-icons/fa"; // 아이콘 추가
import PatientInfoCard from "./PatientInfoCard";
import styles from "./NavigationList.module.css";

interface NavigationListProps {
  isFollowUp: boolean;
  isRecording: boolean; // 녹음 상태 추가
}

const NavigationList: React.FC<NavigationListProps> = ({ isFollowUp, isRecording }) => {
  const [selectedId, setSelectedId] = useState<string>("");

  const topics = isFollowUp
    ? [
      { id: "recording", title: "녹음하기" },
      { id: "prescriptionDrugs", title: "처방 의약품" },
      { id: "otcAndSupplements", title: "일반의약품+건강기능식품" },
      { id: "pharmacistIntervention", title: "약사 중재 내용" },
      { id: "careNotes", title: "돌봄 노트" },
    ]
    : [
      { id: "recording", title: "녹음하기" },
      { id: "patientInfo", title: "환자 상세 정보" },
      { id: "preQuestions", title: "상담 전 질문" },
      { id: "prescriptionDrugs", title: "처방 의약품" },
      { id: "otcAndSupplements", title: "일반의약품+건강기능식품" },
    ];

  const handleNavigationClick = (id: string) => {
    setSelectedId(id);

    const element = document.getElementById(id);
    if (element) {
      const rootStyles = getComputedStyle(document.documentElement);
      const headerHeight = parseInt(rootStyles.getPropertyValue("--header-height"), 10);
      const offsetPosition = element.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles.navigationList}>
      <PatientInfoCard
        patientInfo={{
          id: 1,
          name: "김철수",
          gender: "남성",
          birthDate: "1996-05-15",
          phoneNumber: "010-1234-5678",
        }}
      />
      <h2>{isFollowUp ? "2차 상담" : "1차 상담"}</h2>
      <ol>
        {topics.map((t) => (
          <li key={t.id} className={styles.navItem}>
            <button onClick={() => handleNavigationClick(t.id)} className={styles.navButton}>
              {t.title}
            </button>
            {selectedId === t.id && <FaPencilAlt className={styles.penIcon} />}
            {t.id === "recording" && isRecording && <FaMicrophone className={styles.recordIcon} />}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default NavigationList;

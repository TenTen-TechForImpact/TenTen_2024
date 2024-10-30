// src/components/Sidebar/NavigationList.tsx
"use client";

import React, { useState } from 'react';
import PatientInfoCard from './PatientInfoCard'; // 환자 정보 카드 컴포넌트 임포트
import styles from './NavigationList.module.css';

interface NavigationListProps {
  isFollowUp: boolean;
}

const NavigationList: React.FC<NavigationListProps> = ({ isFollowUp }) => {
  const [selectedId, setSelectedId] = useState<string>("");

  const topics = isFollowUp
    ? [
      { id: "prescriptionDrugs", title: "처방 의약품" },
      { id: "otcAndSupplements", title: "일반의약품+건강기능식품" },
      { id: "pharmacistIntervention", title: "약사 중재 내용" },
      { id: "careNotes", title: "돌봄 노트" },
    ]
    : [
      { id: "patientInfo", title: "환자 상세 정보" },
      { id: "preQuestions", title: "상담 전 질문" },
      { id: "prescriptionDrugs", title: "처방 의약품" },
      { id: "otcAndSupplements", title: "일반의약품+건강기능식품" },
    ];

  const handleNavigationClick = (id: string) => {
    setSelectedId(id);
    console.log("Hi")

    const element = document.getElementById(id);
    if (element) {
      console.log("Why");
      const rootStyles = getComputedStyle(document.documentElement);
      const headerHeight = parseInt(rootStyles.getPropertyValue('--header-height'), 10);

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
            <button
              onClick={() => handleNavigationClick(t.id)}
              className={styles.navButton}
            >
              {t.title}
            </button>
            {selectedId === t.id && <span className={styles.penIcon}>✏️</span>}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default NavigationList;

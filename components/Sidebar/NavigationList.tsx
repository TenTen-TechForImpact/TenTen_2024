// src/components/Sidebar/NavigationList.tsx
"use client";

import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setSelectedSection } from "../../store/navigationSlice";
import styles from './NavigationList.module.css';

interface NavigationListProps {
  isFirstSession: boolean;
}

const NavigationList: React.FC<NavigationListProps> = ({ isFirstSession }) => {
  const dispatch = useDispatch();
  const selectedId = useSelector((state: RootState) => state.navigation.selectedSection);
  const topics = isFirstSession
    ? [
      { id: "patientInfo", title: "환자 상세 정보" },
      { id: "preQuestions", title: "상담 전 질문" },
      { id: "prescriptionDrugs", title: "처방의약품" },
      { id: "otcAndSupplements", title: "일반의약품+건강기능식품" },
    ]
    : [
      { id: "prescriptionDrugs", title: "처방의약품" },
      { id: "otcAndSupplements", title: "일반의약품+건강기능식품" },
      { id: "pharmacistIntervention", title: "약사 중재 내용" },
      { id: "careNotes", title: "돌봄 노트" },
    ];

  const handleNavigationClick = (id: string) => {
    dispatch(setSelectedSection(id));
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const lis = topics.map((t) => (
    <li key={t.id} className={styles.navItem}>
      <button onClick={() => handleNavigationClick(t.id)} className={styles.navButton}>
        {t.title}
      </button>
      {selectedId === t.id && <span className={styles.penIcon}>✏️</span>}
    </li>
  ));

  return (
    <div className={styles.navigationList}>
      <h2>{isFirstSession ? "1차 상담" : "2차 상담"}</h2>
      <ol>{lis}</ol>
    </div>
  );
};

export default NavigationList;

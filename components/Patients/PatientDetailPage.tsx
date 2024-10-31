"use client"; // 클라이언트 컴포넌트로 설정

import React, { useEffect, useState } from "react";
import SessionCard from "./SessionCard";
import Header from "../Header/Header";
import styles from "./PatientDetailPage.module.css";

const PatientDetailPage: React.FC<{ patientId: number }> = ({ patientId }) => {
  const [sessions, setSessions] = useState<{ id: number; date: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 더미 데이터
  const dummySessions = [
    { id: 1, date: "2024-10-30" },
    { id: 2, date: "2024-10-28" },
    { id: 3, date: "2024-10-25" },
  ];

  useEffect(() => {
    // API 호출 주석 처리
    // const loadSessions = async () => {
    //   try {
    //     const data = await fetchSessions(patientId);
    //     setSessions(data.sessions);
    //   } catch (err) {
    //     setError(err.message);
    //   }
    // };

    // 더미 데이터 설정
    setSessions(dummySessions);

    // loadSessions();
  }, [patientId]);

  const handleAddSession = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-CA");

    // 더미 데이터 추가
    const newSession = { id: sessions.length + 1, date: formattedDate }; // ID 자동 생성
    // 새로 생성된 상담을 배열의 맨 앞에 추가
    setSessions((prevSessions) => [newSession, ...prevSessions]);
  };

  return (
    <div className={styles.detailPage}>
      <Header />
      <h2>환자 상세 정보</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <div className={styles.sessionContainer}>
        <div className={styles.addSessionCard} onClick={handleAddSession}>
          <span className={styles.addButton}>+</span>
        </div>
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            date={session.date}
            onViewDetails={() =>
              console.log(`Viewing details for session ${session.id}`)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default PatientDetailPage;

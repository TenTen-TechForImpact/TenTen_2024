"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SessionCard from "./SessionCard";
import Header from "../Header/Header";
import styles from "./PatientDetailPage.module.css";

const PatientDetailPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const patientId = pathname.split("/").pop();

  const [sessions, setSessions] = useState<{ id: string; date: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const loadSessions = async () => {
      try {
        const data = await fetchSessions(patientId);
        if (data.sessions) {
          setSessions(data.sessions);
        } else {
          // api 미구현 시 빈 배열로
          setSessions([]);
        }
      } catch (err: any) {
        setError(err.message);
      }
    };

    loadSessions();
  }, [patientId]);

  const fetchSessions = async (patientId: string) => {
    const response = await fetch(`/api/patients/${patientId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch patient sessions");
    }
    return await response.json();
  };

  const handleAddSession = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-CA");

    const newSession = { id: `${sessions.length + 1}`, date: formattedDate };
    setSessions((prevSessions) => [newSession, ...prevSessions]);
  };

  const handleDeleteSession = (id: string) => {
    // 더미 삭제 기능
    setSessions((prevSessions) =>
      prevSessions.filter((session) => session.id !== id)
    );
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
        {sessions && sessions.length > 0 ? (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              id={session.id}
              date={session.date}
              onViewDetails={() => router.push(`../sessions`)}
              onDelete={handleDeleteSession}
            />
          ))
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default PatientDetailPage;

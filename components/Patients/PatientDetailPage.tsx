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

  const [sessions, setSessions] = useState<
    { id: string; session_datetime: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    try {
      const data = await fetchSessions(patientId);
      if (data.sessions) {
        setSessions(data.sessions);
      } else {
        // api 미구현 시 빈 배열로
        console.log("세션 없음");
        setSessions([]);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!patientId) return;
    loadSessions();
  }, [patientId]);

  const fetchSessions = async (patientId: string) => {
    const response = await fetch(`/api/patients/${patientId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch patient sessions");
    }
    return await response.json();
  };

  const handleAddSession = async () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-CA");

    // Check if a session for today already exists
    const existingSession = sessions.find((session) => {
      // Extract the date part from session.session_datetime
      const sessionDate = new Date(session.session_datetime)
        .toISOString()
        .split("T")[0];
      return sessionDate === formattedDate;
    });

    if (existingSession) {
      alert("이미 오늘 날짜에 생성된 상담 카드가 있습니다.");
      return;
    }

    // Create a new session object with a temporary ID
    const tempId = `temp-${Date.now()}`; // Temporary unique ID
    const newSession = { id: tempId, session_datetime: formattedDate };

    // Optimistically update the sessions state
    setSessions((prevSessions) => [newSession, ...prevSessions]);

    const sessionData = {
      "session-datetime": formattedDate,
    };

    try {
      const response = await fetch(`/api/patients/${patientId}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error("Failed to create a new session");
      }

      // Re-fetch the sessions to get the latest data from the server
      await loadSessions(); // Call the function to reload sessions
    } catch (error) {
      console.error("Error creating session:", error);
      alert("세션 생성에 실패했습니다. 다시 시도해주세요.");

      // Revert the optimistic update in case of an error
      setSessions((prevSessions) =>
        prevSessions.filter((session) => session.id !== tempId)
      );
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      // Make a DELETE request to the backend
      const response = await fetch(
        `/api/patients/${patientId}/sessions/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the session");
      }

      // Remove the session from the state
      setSessions((prevSessions) =>
        prevSessions.filter((session) => session.id !== id)
      );
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("세션 삭제에 실패했습니다. 다시 시도해주세요.");
    }
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
              dateTime={session.session_datetime}
              onViewDetails={() => router.push(`../sessions/${session.id}`)}
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

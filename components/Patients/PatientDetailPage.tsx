"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SessionCard from "./SessionCard";
import Header from "../Header/Header";
import SessionAddModal from "./SessionAddModal";
import styles from "./PatientDetailPage.module.css";

interface Patient {
  id: string;
  name: string;
  date_of_birth: Date;
  gender: string;
  phone_number: string;
  organization: string;
  created_at: Date;
  modified_at: Date;
}

interface Session {
  id: string;
  patient_id: string;
  session_datetime: Date;
  title: string;
  status: string | null;
  pharmacist_summary: string | null;
  patient_summary: string | null;
  form_type: string | null;
  form_content: string | null;
  created_at: Date;
  modified_at: Date;
  former_questions: string | null;
  prescription_drugs: string | null;
  other_drugs: string | null;
  pharmacist_note: string | null;
  temp: string | null;
}

const PatientDetailPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const patientId = pathname.split("/").pop();

  const [loading, setLoading] = useState(true);
  const [patientInfo, setPatientInfo] = useState<Patient | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await fetchPatientInfo(patientId as string);
      const formattedPatientInfo = {
        ...data.patient,
        created_at: new Date(data.patient.created_at),
        modified_at: new Date(data.patient.modified_at),
        date_of_birth: new Date(data.patient.date_of_birth),
      };
      const formattedSessions = data.sessions.map((session: Session) => ({
        ...session,
        created_at: new Date(session.created_at),
        modified_at: new Date(session.modified_at),
        session_datetime: new Date(session.session_datetime),
      }));

      setPatientInfo(formattedPatientInfo);
      setSessions(formattedSessions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!patientId) return;
    loadSessions();
  }, [patientId]);

  const fetchPatientInfo = async (
    patientId: string
  ): Promise<{ patient: Patient; sessions: Session[] }> => {
    const response = await fetch(`/api/patients/${patientId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch patient information");
    }
    return await response.json();
  };

  const handleAddSession = () => {
    setSelectedSession(null);
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleEditSession = (session: Session) => {
    setSelectedSession(session);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSession(null);
    setIsEditMode(false);
  };

  const handleSubmitSession = async (sessionData: {
    title: string;
    session_datetime: Date;
  }) => {
    try {
      const formattedSessionData = {
        title: sessionData.title,
        session_datetime: sessionData.session_datetime.toISOString(),
      };
      if (isEditMode && selectedSession) {
        const response = await fetch(
          `/api/patients/${patientId}/sessions/${selectedSession.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedSessionData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update session");
        }
        await loadSessions();
      } else {
        const response = await fetch(`/api/patients/${patientId}/sessions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedSessionData),
        });

        if (!response.ok) {
          throw new Error("Failed to create session");
        }
        await loadSessions();
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting session:", error);
      alert("세션 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/patients/${patientId}/sessions/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }

      setSessions((prevSessions) =>
        prevSessions.filter((session) => session.id !== id)
      );
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("세션 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
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
              modifiedDateTime={session.modified_at}
              title={session.title}
              onViewDetails={() => router.push(`../sessions/${session.id}`)}
              onDelete={() => handleDeleteSession(session.id)}
              onEdit={() => handleEditSession(session)}
            />
          ))
        ) : (
          <p>상담 카드 로딩 중...</p>
        )}
      </div>
      {showModal && (
        <SessionAddModal
          session={selectedSession || undefined}
          patient={patientInfo}
          isEditMode={isEditMode}
          onClose={handleCloseModal}
          onSubmit={handleSubmitSession}
        />
      )}
    </div>
  );
};

export default PatientDetailPage;

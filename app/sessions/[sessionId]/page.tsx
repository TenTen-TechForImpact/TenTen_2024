"use client";

import { useEffect, useState } from "react";

interface Session {
  id: string;
  title: string;
  session_datetime: string;
  pharmacist_summary: string;
  created_at: string;
  updated_at: string;
  // 세션에 포함된 다른 필드들을 추가
}

interface Props {
  params: { sessionId: string };
}

export default function SessionPage({ params }: Props) {
  const { sessionId } = params;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessionData() {
      try {
        const response = await fetch(`/api/sessions/${sessionId}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch session data");
        }

        const data: Session = await response.json();
        setSession(data);
      } catch (err) {
        console.error("Error fetching session data:", err);
        setError("Failed to load session data.");
      } finally {
        setLoading(false);
      }
    }

    fetchSessionData();
  }, [sessionId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Session Details</h1>
      {session ? (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <h2>{session.title}</h2>
          <p>
            <strong>Session datetime:</strong> {session.session_datetime}
          </p>
          <p>
            <strong>Pharmacist summary:</strong> {session.pharmacist_summary}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(session.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(session.updated_at).toLocaleString()}
          </p>
          {/* 다른 세션 정보들을 추가로 표시 */}
        </div>
      ) : (
        <p>No session data available.</p>
      )}
    </div>
  );
}

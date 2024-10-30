"use client";

import { useState, useEffect } from "react";

interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
  gender: string;
  phone_number: string;
  organization: string;
  created_at: string;
}

export default function PatientForm() {
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    gender: "",
    phone_number: "",
    organization: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create patient record");
      }

      const data = await response.json();
      setSuccess("Patient record created successfully!");
      setFormData({
        name: "",
        date_of_birth: "",
        gender: "",
        phone_number: "",
        organization: "",
      });
      fetchPatients(); // 새 환자 추가 후 목록을 다시 가져옵니다.
    } catch (err) {
      console.error("Error creating patient record:", err);
      setError("Error creating patient record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 전체 환자 목록을 가져오는 함수
  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      const response = await fetch("/api/patients", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data: Patient[] = await response.json();
      setPatients(data);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Error fetching patient data.");
    } finally {
      setLoadingPatients(false);
    }
  };

  // 컴포넌트가 처음 로드될 때 전체 환자 목록을 가져옵니다.
  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div>
      <h1>Create Patient Record</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Date of Birth:
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Gender:
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Phone Number:
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Organization:
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Create Record"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <h2>Patient List</h2>
      {loadingPatients ? (
        <p>Loading patients...</p>
      ) : (
        <ul>
          {patients.map((patient) => (
            <li key={patient.id}>
              <p>
                <strong>Name:</strong> {patient.name}
              </p>
              <p>
                <strong>Date of Birth:</strong> {patient.date_of_birth}
              </p>
              <p>
                <strong>Gender:</strong> {patient.gender}
              </p>
              <p>
                <strong>Phone Number:</strong> {patient.phone_number}
              </p>
              <p>
                <strong>Organization:</strong> {patient.organization}
              </p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

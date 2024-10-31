"use client";

import React, { useEffect, useState } from "react";
import styles from "./PatientsListPage.module.css";
import SearchBar from "@/components/SearchBar";
import ActionButton from "@/components/ActionButton";
import SortOptions from "@/components/SortOptions";
import PatientCard from "@/components/Patients/PatientCard";
import PatientAddModal from "@/components/Patients/PatientAddModal";

interface Patient {
  id: string;
  name: string;
  date_of_birth: string;
  gender: string;
  phone_number: string;
  organization: string;
}

const PatientsListPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, [sortOption]);

  // API를 통해 환자 목록을 가져오는 함수
  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/patients", { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch patients");

      const data: Patient[] = await response.json();
      setPatients(data);
    } catch (err) {
      setError("환자 목록을 불러오는 데 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // API를 통해 새 환자를 추가하는 함수
  const handleAddPatient = async (patientData: Omit<Patient, "id">) => {
    setLoading(true);
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create patient: ${errorText}`);
      }

      setShowModal(false);
      fetchPatients();
    } catch (err) {
      console.error("Error:", err);
      setError("새 환자를 추가하는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 환자 삭제 함수
  const handleDeletePatient = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete patient");

      setPatients((prevPatients) =>
        prevPatients.filter((patient) => patient.id !== id)
      );
    } catch (err) {
      console.error("Error:", err);
      setError("환자를 삭제하는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.patientListContainer}>
      <div className={styles.searchAndAdd}>
        <SearchBar
          placeholder="검색어를 입력하세요"
          onSearch={(term) => setSearchTerm(term)}
        />
        <ActionButton
          text="+"
          onClick={() => setShowModal(true)}
          width={150}
          height={57}
          fontSize={64}
        />
      </div>

      <div className={styles.listHeader}>
        <h2 className={styles.title}>전체 환자 목록</h2>
        <SortOptions
          options={[
            { value: "name", label: "이름순" },
            { value: "age", label: "나이순" },
          ]}
          onChange={(e) => setSortOption(e.target.value)}
        />
      </div>

      {showModal && (
        <PatientAddModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddPatient}
        />
      )}

      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.patientList}>
        {loading ? (
          <p>Loading patients...</p>
        ) : (
          patients
            .filter(
              (patient) =>
                patient.name?.includes(searchTerm) ||
                patient.phone_number?.includes(searchTerm) ||
                patient.organization?.includes(searchTerm)
            )
            .map((patient) => (
              <PatientCard
                key={patient.id}
                id={patient.id}
                name={patient.name}
                age={calculateAge(patient.date_of_birth)}
                gender={patient.gender}
                onDelete={() => handleDeletePatient(patient.id)} // 삭제 함수 전달
              />
            ))
        )}
      </div>
    </div>
  );
};

export default PatientsListPage;

// 생년월일을 기반으로 나이를 계산하는 함수
function calculateAge(date_of_birth: string) {
  const today = new Date();
  const birth = new Date(date_of_birth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

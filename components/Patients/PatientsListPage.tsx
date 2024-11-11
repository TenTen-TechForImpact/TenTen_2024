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
  date_of_birth: Date;
  gender: string;
  phone_number: string;
  organization: string;
  created_at: Date;
  modified_at: Date;
}

const PatientsListPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  // API를 통해 환자 목록을 가져오는 함수
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/patients", { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch patients");

      const data: Patient[] = await response.json();
      const formattedPatients = data.map((patient) => ({
        ...patient,
        date_of_birth: new Date(patient.date_of_birth),
        created_at: new Date(patient.created_at),
        modified_at: new Date(patient.modified_at),
      }));
      setPatients(formattedPatients);
    } catch (err) {
      console.error("환자 목록을 불러오는 데 문제가 발생했습니다:", err);
    } finally {
      setLoading(false);
    }
  };

  // 정렬 함수
  const sortPatients = (patients: Patient[]) => {
    return [...patients].sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "age") {
        const ageA = calculateAge(a.date_of_birth);
        const ageB = calculateAge(b.date_of_birth);
        return ageA - ageB;
      } else if (sortOption === "modified") {
        return b.modified_at.getTime() - a.modified_at.getTime()
      }
      return 0;
    });
  };

  // API를 통해 새 환자를 추가하는 함수
  const handleAddPatient = async (patientData: Omit<Patient, "id">) => {
    setLoading(true);
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...patientData,
          date_of_birth: patientData.date_of_birth.toISOString(),
          created_at: new Date().toISOString(),
          modified_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create patient: ${errorText}`);
      }

      setShowModal(false);
      fetchPatients();
    } catch (err) {
      console.error("새 환자를 추가하는 데 실패했습니다:", err);
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
      console.error("환자를 삭제하는 데 실패했습니다:", err);
    } finally {
      setLoading(false);
    }
  };

  // 환자 정보 수정 함수
  const handleUpdatePatient = async (patientData: Patient) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/patients/${patientData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...patientData,
          date_of_birth: patientData.date_of_birth.toISOString(),
          created_at: patientData.created_at.toISOString(),
          modified_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to update patient");

      setShowModal(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (err) {
      console.error("환자 정보를 수정하는 데 실패했습니다:", err);
    } finally {
      setLoading(false);
    }
  };

  // 환자 정보 수정 핸들러
  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (value: string) => {
    setSortOption(value);
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
            { value: "name", label: "이름 순" },
            { value: "age", label: "나이 순" },
            { value: "modified", label: "수정 순" },
          ]}
          onChange={(value) => setSortOption(value)}
        />
      </div>

      {showModal && (
        <PatientAddModal
          patient={selectedPatient}
          isEditMode={!!selectedPatient}
          onClose={() => {
            setShowModal(false);
            setSelectedPatient(null);
          }}
          onSubmit={selectedPatient ? handleUpdatePatient : handleAddPatient}
        />
      )}

      {loading ? (
        <p>환자 목록 로딩 중...</p>
      ) : (
        <div className={styles.patientList}>
          {sortPatients(
            patients.filter(
              (patient) =>
                patient.name?.includes(searchTerm) ||
                patient.phone_number?.includes(searchTerm) ||
                patient.organization?.includes(searchTerm)
            )
          ).map((patient) => (
            <PatientCard
              key={patient.id}
              id={patient.id}
              name={patient.name}
              age={calculateAge(patient.date_of_birth)}
              gender={patient.gender}
              phone_number={patient.phone_number}
              organization={patient.organization}
              onDelete={() => handleDeletePatient(patient.id)}
              onEdit={() => handleEditPatient(patient)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientsListPage;

// 생년월일을 기반으로 나이를 계산하는 함수
function calculateAge(date_of_birth: Date) {
  const today = new Date();
  let age = today.getFullYear() - date_of_birth.getFullYear();
  const monthDiff = today.getMonth() - date_of_birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date_of_birth.getDate())) {
    age--;
  }
  return age;
}


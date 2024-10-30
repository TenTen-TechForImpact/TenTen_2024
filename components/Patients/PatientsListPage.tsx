"use client";

import React, { useEffect, useState } from "react";
import styles from "./PatientsListPage.module.css";
import SearchBar from "@/components/SearchBar";
import ActionButton from "@/components/ActionButton";
import SortOptions from "@/components/SortOptions";
import PatientCard from "@/components/Patients/PatientCard";
import PatientAddModal from "@/components/Patients/PatientAddModal";

const PatientsListPage = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setPatients([
      { id: 1, name: "홍길동", birthDate: "1980-05-15", gender: "남" },
      { id: 2, name: "이몽룡", birthDate: "1975-08-22", gender: "남" },
    ]);

    // 실제 API 연동 시 사용
    // fetchPatients();
  }, [sortOption]);

  const handleAddPatient = (patientData) => {
    const newPatient = {
      id: patients.length + 1,
      ...patientData,
    };
    setPatients((prevPatients) => [...prevPatients, newPatient]);
  };

  return (
    <div className={styles.patientListContainer}>
      <div className={styles.searchAndAdd}>
        <SearchBar placeholder="검색어를 입력하세요" onSearch={() => {}} />
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

      <div className={styles.patientList}>
        {patients
          .filter((patient) => patient.name.includes(searchTerm))
          .map((patient) => (
            <PatientCard
              key={patient.id}
              id={patient.id}
              name={patient.name}
              age={calculateAge(patient.birthDate)}
              gender={patient.gender}
            />
          ))}
      </div>
    </div>
  );
};

export default PatientsListPage;

function calculateAge(birthDate: string) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

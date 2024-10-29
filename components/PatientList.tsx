// PatientList.tsx - 환자 리스트 컴포넌트
// 환자 목록을 검색 및 정렬 옵션과 함께 표시

"use client";

import React, { useState } from "react";
import SearchBar from "./SearchBar";
import SortOptions from "./SortOptions";
import PatientCard from "./PatientCard";
import ActionButton from "./ActionButton";
import styles from "./PatientList.module.css";

const PatientList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");

  const handleSearch = (value: string) => setSearchTerm(value);
  const handleSortChange = (value: string) => setSortOption(value);

  const patients = [
    { id: 1, name: "홍길동", age: 30, gender: "남" },
    { id: 2, name: "김철수", age: 25, gender: "남" },
  ];

  return (
    <div className={styles.patientListContainer}>
      <div className={styles.searchAndAdd}>
        <SearchBar placeholder="검색어를 입력하세요" onSearch={handleSearch} />
        <ActionButton
          text="+"
          onClick={() => console.log("Add")}
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
          onChange={handleSortChange}
        />
      </div>
      <div className={styles.patientList}>
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            name={patient.name}
            age={patient.age}
            gender={patient.gender}
          />
        ))}
      </div>
    </div>
  );
};

export default PatientList;

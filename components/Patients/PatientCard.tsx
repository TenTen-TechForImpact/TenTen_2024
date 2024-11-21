"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./PatientCard.module.css";

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

interface PatientCardProps {
  patient: Patient;
  onDelete: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onDelete, onEdit }) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleViewDetails = () => {
    router.push(`/patients/${patient.id}`);
  };

  const handleDeleteClick = () => {
    onDelete(patient);
    setShowDropdown(false);
  };

  const handleEditClick = () => {
    onEdit(patient);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className={styles.patientContainer}>
      <div className={styles.patientRow}>
        <div className={styles.patientField}>{patient.name}</div>
        <div className={styles.patientField}>
          {patient.date_of_birth.toISOString().split("T")[0]}
        </div>
        <div className={styles.patientField}>{patient.gender}</div>
        <div className={styles.patientField}>
          {patient.modified_at.toISOString().split("T")[0]}
        </div>
        <button className={styles.actionButton} onClick={() => setShowDropdown(!showDropdown)}>
          ⋮
        </button>
        {showDropdown && (
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownItem} onClick={() => onEdit(patient)}>
              수정
            </div>
            <div className={styles.dropdownItem} onClick={() => onDelete(patient)}>
              삭제
            </div>
            <div className={styles.dropdownItem} onClick={handleViewDetails}>
              상담 보기
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default PatientCard;

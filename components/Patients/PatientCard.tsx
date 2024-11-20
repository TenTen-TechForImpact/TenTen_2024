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
    <div className={styles.patientRow}>
      <span>{patient.name}</span>
      <span>{patient.date_of_birth.toISOString().split("T")[0]}</span>
      <span>{patient.gender}</span>
      <span>{patient.modified_at.toISOString().split("T")[0]}</span>
      <button className={styles.actionButton} onClick={toggleDropdown}>⋮</button>

      {showDropdown && (
        <div className={styles.dropdownMenu}>
          <button className={styles.dropdownItem} onClick={handleEditClick}>
            수정
          </button>
          <button className={styles.dropdownItem} onClick={handleDeleteClick}>
            삭제
          </button>
        </div>
      )}
    </div>
  );

};

export default PatientCard;

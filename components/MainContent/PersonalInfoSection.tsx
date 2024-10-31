// src/components/MainContent/PersonalInfoSection.tsx
import React, { useState } from 'react';
import { FaPencilAlt, FaSave } from 'react-icons/fa';
import styles from './PersonalInfoSection.module.css';

interface PersonalInfoSectionProps {
  patientInfo: any;
  setPatientInfo: React.Dispatch<React.SetStateAction<any>>;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ patientInfo, setPatientInfo }) => {
  const [isEditing, setIsEditing] = useState({
    personal: false,
    medical: false,
    lifestyle: false,
    management: false,
  });

  const handleIconClick = (section: string) => {
    setIsEditing((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setPatientInfo((prev: any) => ({ ...prev, [field]: e.target.value }));
  };

  const renderInputField = (label: string, field: string, section: keyof typeof isEditing, placeholder: string) => (
    <div className={styles.infoItem}>
      <label className={styles.label}>{label}</label>
      {isEditing[section] ? (
        <input
          type="text"
          value={patientInfo[field]}
          onChange={(e) => handleChange(e, field)}
          className={styles.inputField}
          placeholder={placeholder}
        />
      ) : (
        <p className={`${styles.textField} ${styles.grayText}`}>{patientInfo[field] || placeholder}</p>
      )}
    </div>
  );

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>환자 상세 정보</h3>

      {/* 개인정보 */}
      <div className={styles.infoSection}>
        <div className={styles.titleContainer}>
          <h4>개인정보</h4>
          <button className={styles.iconButton} onClick={() => handleIconClick('personal')}>
            {isEditing.personal ? <FaSave /> : <FaPencilAlt />}
          </button>
        </div>
        {renderInputField("생년월일", "birthDate", "personal", "생년월일을 입력하세요")}
        {renderInputField("주소", "address", "personal", "주소를 입력하세요")}
        {renderInputField("연락처", "contact", "personal", "연락처를 입력하세요")}
      </div>

      {/* 의료관련 */}
      <div className={styles.infoSection}>
        <div className={styles.titleContainer}>
          <h4>의료관련</h4>
          <button className={styles.iconButton} onClick={() => handleIconClick('medical')}>
            {isEditing.medical ? <FaSave /> : <FaPencilAlt />}
          </button>
        </div>
        {renderInputField("의료보험형태", "insurance", "medical", "의료보험형태를 입력하세요")}
        {renderInputField("알고 있는 질병", "disease", "medical", "질병을 입력하세요")}
        {renderInputField("알레르기 및 약물 부작용", "allergies", "medical", "알레르기/약물 부작용을 입력하세요")}
      </div>

      {/* 생활습관 */}
      <div className={styles.infoSection}>
        <div className={styles.titleContainer}>
          <h4>생활습관</h4>
          <button className={styles.iconButton} onClick={() => handleIconClick('lifestyle')}>
            {isEditing.lifestyle ? <FaSave /> : <FaPencilAlt />}
          </button>
        </div>
        {renderInputField("흡연", "smoking", "lifestyle", "흡연 상태를 입력하세요")}
        {renderInputField("음주", "drinking", "lifestyle", "음주 상태를 입력하세요")}
        {renderInputField("운동", "exercise", "lifestyle", "운동 상태를 입력하세요")}
        {renderInputField("영양", "diet", "lifestyle", "영양 상태를 입력하세요")}
      </div>

      {/* 복용관리 */}
      <div className={styles.infoSection}>
        <div className={styles.titleContainer}>
          <h4>복용관리</h4>
          <button className={styles.iconButton} onClick={() => handleIconClick('management')}>
            {isEditing.management ? <FaSave /> : <FaPencilAlt />}
          </button>
        </div>
        {renderInputField("독거 여부", "livingAlone", "management", "독거 여부를 입력하세요")}
        {renderInputField("약 복용자", "medicineManager", "management", "약 복용자를 입력하세요")}
        {renderInputField("약 보관 장소", "medicineStorage", "management", "약 보관 장소를 입력하세요")}
        {renderInputField("처방전/설명서 보관", "prescriptionStorage", "management", "처방전/설명서 보관 여부를 입력하세요")}
      </div>
    </div>
  );
};

export default PersonalInfoSection;

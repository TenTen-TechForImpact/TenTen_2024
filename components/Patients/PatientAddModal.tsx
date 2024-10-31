import React, { useState, useRef } from "react";
import styles from "./PatientAddModal.module.css";

interface PatientAddModalProps {
  onClose: () => void;
  onSubmit: (patientData: {
    name: string;
    date_of_birth: string;
    gender: string;
    phone_number: string;
    organization: string;
  }) => void;
}

const PatientAddModal: React.FC<PatientAddModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [organization, setOrganization] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  const handleBirthDateInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const value = e.target.value.replace(/\D/g, ""); // 숫자만 입력 가능
    if (type === "year") {
      setBirthYear(value);
      if (value.length === 4) monthRef.current?.focus(); // 연도 입력 완료 시 월로 이동
    } else if (type === "month") {
      setBirthMonth(value);
      if (value.length === 2) dayRef.current?.focus(); // 월 입력 완료 시 일로 이동
    } else if (type === "day") {
      setBirthDay(value);
    }
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = "이름을 입력하세요";
    if (!birthYear || !birthMonth || !birthDay)
      newErrors.date_of_birth = "생년월일을 입력하세요";
    if (!gender) newErrors.gender = "성별을 입력하세요";
    if (!phoneNumber) newErrors.phone_number = "전화번호를 입력하세요";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const date_of_birth = `${birthYear}-${birthMonth.padStart(
      2,
      "0"
    )}-${birthDay.padStart(2, "0")}`;
    onSubmit({
      name,
      date_of_birth,
      gender,
      phone_number: phoneNumber,
      organization,
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>새 환자 추가</h2>

        <input
          type="text"
          placeholder="이름 *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.inputField}
        />
        {errors.name && (
          <div className={styles.errorMessage}>{errors.name}</div>
        )}

        <div className={styles.dateContainer}>
          <input
            type="text"
            placeholder="생년 (YYYY)"
            value={birthYear}
            onChange={(e) => handleBirthDateInput(e, "year")}
            maxLength={4}
            className={`${styles.inputField} ${styles.dateInput}`}
          />
          <input
            type="text"
            placeholder="월 (MM)"
            ref={monthRef}
            value={birthMonth}
            onChange={(e) => handleBirthDateInput(e, "month")}
            maxLength={2}
            className={`${styles.inputField} ${styles.dateInput}`}
          />
          <input
            type="text"
            placeholder="일 (DD) *"
            ref={dayRef}
            value={birthDay}
            onChange={(e) => handleBirthDateInput(e, "day")}
            maxLength={2}
            className={`${styles.inputField} ${styles.dateInput}`}
          />
        </div>
        {errors.date_of_birth && (
          <div className={styles.errorMessage}>{errors.date_of_birth}</div>
        )}

        <input
          type="text"
          placeholder="성별 (남, 여) *"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className={styles.inputField}
        />
        {errors.gender && (
          <div className={styles.errorMessage}>{errors.gender}</div>
        )}

        <input
          type="text"
          placeholder="전화번호 (01012345678) *"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className={styles.inputField}
        />
        {errors.phone_number && (
          <div className={styles.errorMessage}>{errors.phone_number}</div>
        )}

        <input
          type="text"
          placeholder="소속"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className={styles.inputField}
        />

        <button onClick={handleSubmit} className={styles.primaryButton}>
          추가
        </button>
        <button onClick={onClose} className={styles.secondaryButton}>
          취소
        </button>
      </div>
    </div>
  );
};

export default PatientAddModal;

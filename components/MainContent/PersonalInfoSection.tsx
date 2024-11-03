import React from "react";
import styles from "./PersonalInfoSection.module.css";

interface PersonalInfoSectionProps {
  patientInfo: any;
  setPatientInfo: React.Dispatch<React.SetStateAction<any>>;
}

type QuestionType =
  | "text"
  | "yesNo"
  | "radio"
  | "multiCheckbox"
  | "multiCheckboxWithOther"
  | "yesNoWithText"
  | "yesNoWithSingleCheckbox"
  | "yesNoWithConditionalText"
  | "multipleText";

interface Question {
  label: string;
  field: string;
  type: QuestionType;
  options?: string[];
  subFields?: { label: string; field: string }[];
  count?: number;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  patientInfo,
  setPatientInfo,
}) => {
  const handleInputChange = (field: string, value: any) => {
    setPatientInfo((prev: any) => ({ ...prev, [field]: value }));
  };

  const renderInputField = (question: Question) => {
    const { label, field, type, options, subFields } = question;
    switch (type) {
      case "text":
        return (
          <div className={styles.infoItem}>
            <label className={styles.label}>{label}</label>
            <input
              type="text"
              value={patientInfo[field] || ""}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={styles.inputField}
              placeholder="내용을 입력하세요"
            />
          </div>
        );
      case "radio":
        return (
          <div className={styles.infoItem}>
            <label className={styles.label}>{label}</label>
            <div className={styles.radioContainer}>
              {options?.map((option, index) => (
                <label key={index} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name={field}
                    value={option}
                    checked={patientInfo[field] === option}
                    onChange={() => handleInputChange(field, option)}
                    className={styles.radioInput}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        );

      case "multiCheckbox":
        return (
          <div className={styles.infoItem}>
            <label className={styles.label}>{label}</label>
            <div className={styles.checkboxContainer}>
              {options?.map((option, index) => (
                <label key={index} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={patientInfo[field]?.includes(option) || false}
                    onChange={(e) => {
                      const selectedOptions = patientInfo[field] || [];
                      if (e.target.checked) {
                        console.log(`Adding option: ${option}`); // 디버깅용 로그
                        handleInputChange(field, [...selectedOptions, option]);
                      } else {
                        console.log(`Removing option: ${option}`); // 디버깅용 로그
                        handleInputChange(
                          field,
                          selectedOptions.filter(
                            (item: string) => item !== option
                          )
                        );
                      }
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        );

      case "multiCheckboxWithOther":
        return (
          <div className={styles.infoItem}>
            <label className={styles.label}>{label}</label>
            <div className={styles.checkboxContainer}>
              {options?.map((option, index) => (
                <label key={index} className={styles.checkboxLabel}>
                  <input
                    type="radio"
                    name={field}
                    checked={patientInfo[field]?.selectedOption === option}
                    onChange={() =>
                      handleInputChange(field, { selectedOption: option })
                    }
                  />
                  {option}
                </label>
              ))}
              {patientInfo[field]?.selectedOption === "기타" && (
                <div className={styles.subField}>
                  <label className={styles.subFieldLabel}>기타</label>
                  <input
                    type="text"
                    value={patientInfo[field]?.otherText || ""}
                    onChange={(e) =>
                      handleInputChange(field, {
                        selectedOption: "기타",
                        otherText: e.target.value,
                      })
                    }
                    className={styles.inputField}
                    placeholder="기타 내용을 입력하세요"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case "yesNo":
        return (
          <div className={styles.infoItem}>
            <label className={styles.label}>{label}</label>
            <div className={styles.yesNoContainer}>
              <button
                className={`${styles.yesNoButton} ${
                  patientInfo[field] === "예" ? styles.active : ""
                }`}
                onClick={() => handleInputChange(field, "예")}
                style={{
                  backgroundColor:
                    patientInfo[field] === "예" ? "#4caf50" : "#f1f1f1",
                  color: patientInfo[field] === "예" ? "white" : "black",
                }}
              >
                예
              </button>
              <button
                className={`${styles.yesNoButton} ${
                  patientInfo[field] === "아니오" ? styles.active : ""
                }`}
                onClick={() => handleInputChange(field, "아니오")}
                style={{
                  backgroundColor:
                    patientInfo[field] === "아니오" ? "#f44336" : "#f1f1f1",
                  color: patientInfo[field] === "아니오" ? "white" : "black",
                }}
              >
                아니오
              </button>
            </div>
          </div>
        );

      case "yesNoWithText":
        return (
          <div className={styles.infoItem}>
            <label className={styles.label}>{label}</label>
            <div className={styles.yesNoContainer}>
              <button
                className={`${styles.yesNoButton} ${
                  patientInfo[field]?.status === "예" ? styles.active : ""
                }`}
                onClick={() => handleInputChange(field, { status: "예" })}
                style={{
                  backgroundColor:
                    patientInfo[field]?.status === "예" ? "#4caf50" : "#f1f1f1",
                  color:
                    patientInfo[field]?.status === "예" ? "white" : "black",
                }}
              >
                예
              </button>
              <button
                className={`${styles.yesNoButton} ${
                  patientInfo[field]?.status === "아니오" ? styles.active : ""
                }`}
                onClick={() => handleInputChange(field, { status: "아니오" })}
                style={{
                  backgroundColor:
                    patientInfo[field]?.status === "아니오"
                      ? "#f44336"
                      : "#f1f1f1",
                  color:
                    patientInfo[field]?.status === "아니오" ? "white" : "black",
                }}
              >
                아니오
              </button>
            </div>
            {patientInfo[field]?.status === "예" &&
              subFields?.map((subField, index) => (
                <div key={index} className={styles.subField}>
                  <label className={styles.subFieldLabel}>
                    {subField.label}
                  </label>
                  <input
                    type="text"
                    value={patientInfo[field]?.[subField.field] || ""}
                    onChange={(e) =>
                      handleInputChange(field, {
                        ...patientInfo[field],
                        [subField.field]: e.target.value,
                      })
                    }
                    className={styles.inputField}
                    placeholder="내용을 입력하세요"
                  />
                </div>
              ))}
          </div>
        );

      case "yesNoWithSingleCheckbox":
        return (
          <div className={styles.infoItem}>
            <label className={styles.label}>{label}</label>
            <div className={styles.yesNoContainer}>
              <button
                className={`${styles.yesNoButton} ${
                  patientInfo[field]?.status === "예" ? styles.active : ""
                }`}
                onClick={() => handleInputChange(field, { status: "예" })}
                style={{
                  backgroundColor:
                    patientInfo[field]?.status === "예" ? "#4caf50" : "#f1f1f1",
                  color:
                    patientInfo[field]?.status === "예" ? "white" : "black",
                }}
              >
                예
              </button>
              <button
                className={`${styles.yesNoButton} ${
                  patientInfo[field]?.status === "아니오" ? styles.active : ""
                }`}
                onClick={() => handleInputChange(field, { status: "아니오" })}
                style={{
                  backgroundColor:
                    patientInfo[field]?.status === "아니오"
                      ? "#f44336"
                      : "#f1f1f1",
                  color:
                    patientInfo[field]?.status === "아니오" ? "white" : "black",
                }}
              >
                아니오
              </button>
            </div>
            {patientInfo[field]?.status === "예" && (
              <div className={styles.checkboxContainer}>
                {options?.map((option, index) => (
                  <label key={index} className={styles.checkboxLabel}>
                    <input
                      type="radio"
                      name={field}
                      checked={patientInfo[field]?.selectedOption === option}
                      onChange={() =>
                        handleInputChange(field, {
                          status: "예",
                          selectedOption: option,
                        })
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        );

      case "yesNoWithConditionalText":
        return (
          <div className={styles.infoItem}>
            <label className={styles.label}>{label}</label>
            <div className={styles.yesNoContainer}>
              <button
                className={`${styles.yesNoButton} ${
                  patientInfo[field]?.status === "예" ? styles.active : ""
                }`}
                onClick={() => handleInputChange(field, { status: "예" })}
                style={{
                  backgroundColor:
                    patientInfo[field]?.status === "예" ? "#4caf50" : "#f1f1f1",
                  color:
                    patientInfo[field]?.status === "예" ? "white" : "black",
                }}
              >
                예
              </button>
              <button
                className={`${styles.yesNoButton} ${
                  patientInfo[field]?.status === "아니오" ? styles.active : ""
                }`}
                onClick={() => handleInputChange(field, { status: "아니오" })}
                style={{
                  backgroundColor:
                    patientInfo[field]?.status === "아니오"
                      ? "#f44336"
                      : "#f1f1f1",
                  color:
                    patientInfo[field]?.status === "아니오" ? "white" : "black",
                }}
              >
                아니오
              </button>
            </div>
            {patientInfo[field]?.status === "아니오" && (
              <div className={styles.subField}>
                <label className={styles.subFieldLabel}>동거 가족구성원</label>
                <input
                  type="text"
                  value={patientInfo[field]?.familyMembers || ""}
                  onChange={(e) =>
                    handleInputChange(field, {
                      status: "아니오",
                      familyMembers: e.target.value,
                    })
                  }
                  className={styles.inputField}
                  placeholder="가족구성원을 입력하세요"
                />
              </div>
            )}
          </div>
        );
      case "multipleText":
        return (
          <div className={styles.infoItem}>
            <label className={styles.label}>{label}</label>
            <div className={styles.multipleTextContainer}>
              {Array.from({ length: question.count || 1 }).map(
                (
                  _,
                  index // Use 'question.count' here
                ) => (
                  <input
                    key={index}
                    type="text"
                    value={patientInfo[field]?.[index] || ""}
                    onChange={(e) => {
                      const newValues = [...(patientInfo[field] || [])];
                      newValues[index] = e.target.value;
                      handleInputChange(field, newValues);
                    }}
                    className={styles.inputField}
                    placeholder={`약사 ${index + 1}`}
                  />
                )
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // 질문 목록
  const questions: Question[] = [
    { label: "참여자 성명", field: "name", type: "text" },
    { label: "생년월일", field: "birthDate", type: "text" },
    { label: "연락처", field: "contact", type: "text" },
    {
      label: "의료보장형태",
      field: "insuranceType",
      type: "radio",
      options: ["건강보험", "의료급여", "보훈", "비급여"],
    },
    { label: "최초 상담일", field: "initialConsultDate", type: "text" },
    { label: "상담일", field: "currentConsultDate", type: "text" },
    { label: "상담 차수", field: "consultSessionNumber", type: "text" },
    {
      label: "상담 약사",
      field: "pharmacistName",
      type: "multipleText",
      count: 3,
    },
    {
      label: "앓고 있는 질병",
      field: "diseases",
      type: "multiCheckbox",
      options: [
        "고혈압",
        "고지혈증",
        "뇌혈관질환",
        "심장질환",
        "당뇨병",
        "갑상선질환",
        "위장관질환",
        "파킨슨",
        "척추·관절염/신경통·근육통",
        "수면장애",
        "우울증/불안장애",
        "치매,인지장애",
        "비뇨·생식기질환(전립선비대증,자궁내막염,방광염 등)",
        "신장질환",
        "호흡기질환(천식,COPD 등)",
        "안질환(백내장,녹내장,안구건조증 등)",
        "이비인후과(만성비염, 만성중이염 등)",
        "암질환",
        "간질환",
        "뇌경색",
      ],
    },
    { label: "기타", field: "additionalDiseaseInfo", type: "text" },
    { label: "과거 질병 및 수술 이력", field: "medicalHistory", type: "text" },
    { label: "주요 불편한 증상", field: "symptoms", type: "text" },
    {
      label: "알러지",
      field: "allergies",
      type: "yesNoWithText",
      subFields: [
        { label: "알레르기 의심 식품 또는 약물", field: "suspectedItem" },
      ],
    },
    {
      label: "약물 부작용",
      field: "adverseDrugReactions",
      type: "yesNoWithText",
      subFields: [
        { label: "부작용 의심 약물", field: "suspectedMedication" },
        { label: "부작용 증상", field: "reactionDetail" },
      ],
    },
    {
      label: "흡연",
      field: "smoking",
      type: "yesNoWithText",
      subFields: [
        { label: "흡연 기간 (년)", field: "duration" },
        { label: "평균 흡연량 (갑)", field: "packsPerDay" },
      ],
    },
    {
      label: "음주",
      field: "drinking",
      type: "yesNoWithText",
      subFields: [
        { label: "음주 횟수 (주)", field: "frequencyPerWeek" },
        { label: "1회 음주량 (병)", field: "amountPerSession" },
      ],
    },
    {
      label: "일주일에 30분 이상 운동을 하십니까?",
      field: "exercise",
      type: "yesNoWithSingleCheckbox",
      options: ["주 1회", "주 2회", "주 3회", "주 4회 이상", "아니요"],
      subFields: [
        { label: "규칙적으로 하는 운동 종류", field: "exerciseType" },
      ],
    },
    {
      label: "매일 규칙적이고 균형 잡힌 식사를 하십니까?",
      field: "diet",
      type: "yesNoWithSingleCheckbox",
      options: ["하루 1회", "하루 2회", "하루 3회", "매일 불규칙함"],
    },
    {
      label: "독거 여부",
      field: "livingCondition",
      type: "yesNoWithConditionalText",
    },
    {
      label:
        "주로 약을 챙겨먹는 사람이 누구입니까? (투약보조자 유무 판별 질문)",
      field: "medicationAssistants",
      type: "multiCheckboxWithOther",
      options: [
        "본인",
        "배우자",
        "자녀",
        "친인척",
        "친구",
        "요양보호사 또는 돌봄종사자",
        "기타",
      ],
    },
    {
      label: "가정 내 별도의 약 보관 장소가 있습니까?",
      field: "medicationStorage",
      type: "yesNoWithText",
      subFields: [{ label: "보관 장소", field: "location" }],
    },
    {
      label: "만일을 위해 처방전/설명서를 보관합니까?",
      field: "prescriptionStorage",
      type: "yesNo",
    },
  ];

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>환자 상세 정보</h3>
      {questions.map((question, index) => (
        <div key={index}>{renderInputField(question)}</div>
      ))}
    </div>
  );
};

export default PersonalInfoSection;

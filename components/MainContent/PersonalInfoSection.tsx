import React from "react";
import debounce from "lodash/debounce";
import styles from "./PersonalInfoSection.module.css";
import { useState, useEffect, useCallback } from "react";

interface PersonalInfoSectionProps {
  patientInfo: any;
  setPatientInfo: React.Dispatch<React.SetStateAction<any>>;
  sessionId: string;
}

type QuestionType =
  | "text"
  | "yesNo"
  | "radio"
  | "multiCheckbox"
  | "multiCheckboxWithOther"
  | "yesNoWithText"
  | "yesNoWithSingleCheckbox"
  | "multipleText";

interface Question {
  label: string;
  field: string;
  type: QuestionType;
  optionsField?: { option: string[]; field: string };
  options?: string[];
  subFields?: { label: string; field: string }[];
  count?: number;
  reverse?: boolean;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  patientInfo,
  setPatientInfo,
  sessionId,
}) => {
  const [lastBlurredValue, setLastBlurredValue] = useState({}); // 직전 값 저장 (변경 시에만 blur함수 작동할 수 있도록)

  useEffect(() => {
    if (Object.keys(lastBlurredValue).length === 0) {
      setLastBlurredValue(patientInfo); // 초기값 한 번만 설정
    }
  }, []);

  // 경로를 올바르게 생성하는 함수
  const constructFieldPath = (baseField: string, subField?: string) => {
    return subField ? `${baseField}.${subField}` : baseField;
  };

  // 중첩된 필드 값을 안전하게 업데이트하는 함수
  const updateNestedField = (obj: any, path: string, value: any) => {
    const keys = path.split(".");
    const lastKey = keys.pop();

    const nestedObj = keys.reduce((acc, key) => {
      if (!acc[key]) acc[key] = {}; // 객체가 없으면 새 객체 생성
      return acc[key];
    }, obj);

    if (lastKey) {
      nestedObj[lastKey] = value;
    }

    return { ...obj }; // 변경된 객체를 반환
  };

  // 상태를 업데이트하는 함수
  const handleInputChange = (field: string, value: any) => {
    // Convert "예" to true and "아니오" to false for boolean fields

    const updatedPatientInfo = updateNestedField(
      { ...patientInfo },
      field,
      value
    );
    setPatientInfo(updatedPatientInfo);
    //console.log("hanled input change");
  };

  // 중첩된 필드 값을 가져오는 함수
  const getNestedValue = (obj: any, path: string) => {
    return path
      .split(".")
      .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  };

  // 필드 값이 변경된 후 서버에 전송하는 함수
  const handleBlur = (baseField: string, subField?: string) => {
    const fieldPath = constructFieldPath(baseField, subField);
    const newValue = getNestedValue(patientInfo, fieldPath);
    const previousValue = getNestedValue(lastBlurredValue, fieldPath); // 직전 값

    // 값이 동일하면 PATCH 생략
    if (newValue === previousValue) {
      //console.log("No changes detected, skipping PATCH request.");
      return;
    }

    const updatedField = {
      [fieldPath]: getNestedValue(patientInfo, fieldPath),
    };
    //console.log("Field updated:", JSON.stringify(updatedField));

    setLastBlurredValue((prev) =>
      updateNestedField({ ...prev }, fieldPath, newValue)
    );

    // 변경 사항을 debounce로 전달
    debouncedPatch(updatedField);
  };

  const debouncedPatch = useCallback(
    debounce((updates) => {
      if (Object.keys(updates).length === 0) return;

      fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates), // 직접 업데이트 값 전송
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update data");
          }
          return response.json();
        })
        .then((data) => {
          //console.log("Data updated successfully:", data);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    }, 1000),
    []
  );

  const renderInputField = (question: Question) => {
    const { label, field, type, options, subFields } = question;
    switch (type) {
      case "text":
        return (
          <div className={styles.infoItem}>
            <label className={styles.label}>{label}</label>
            <input
              type="text"
              value={getNestedValue(patientInfo, field) || ""}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
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
                    checked={getNestedValue(patientInfo, field) === option}
                    onChange={() => {
                      handleInputChange(field, option);
                      handleBlur(field);
                    }}
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
                    checked={
                      getNestedValue(patientInfo, field)?.includes(option) ||
                      false
                    }
                    onChange={(e) => {
                      const selectedOptions =
                        getNestedValue(patientInfo, field) || [];
                      if (e.target.checked) {
                        handleInputChange(field, [...selectedOptions, option]);
                        handleBlur(field);
                      } else {
                        handleInputChange(
                          field,
                          selectedOptions.filter(
                            (item: string) => item !== option
                          )
                        );
                        handleBlur(field);
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
                    checked={getNestedValue(patientInfo, field) === option}
                    onChange={() => {
                      handleInputChange(field, option);
                      handleBlur(field);
                    }}
                  />
                  {option}
                </label>
              ))}
              {/* Inputbox for "기타" */}
              <input
                type="text"
                placeholder="기타"
                value={
                  getNestedValue(patientInfo, field) !==
                  options.find(
                    (opt) => opt === getNestedValue(patientInfo, field)
                  )
                    ? getNestedValue(patientInfo, field)
                    : ""
                }
                onChange={(e) => {
                  handleInputChange(field, e.target.value);
                }}
                onBlur={() => handleBlur(field)}
                className={styles.inputField}
              />
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
                  getNestedValue(patientInfo, field) === "예"
                    ? styles.active
                    : ""
                }`}
                onClick={() => {
                  handleInputChange(field, "예");
                  handleBlur(field);
                }}
                style={{
                  backgroundColor:
                    getNestedValue(patientInfo, field) === "예"
                      ? "#4caf50"
                      : "#f1f1f1",
                  color:
                    getNestedValue(patientInfo, field) === "예"
                      ? "white"
                      : "black",
                }}
              >
                예
              </button>
              <button
                className={`${styles.yesNoButton} ${
                  getNestedValue(patientInfo, field) === "아니오"
                    ? styles.active
                    : ""
                }`}
                onClick={() => {
                  handleInputChange(field, "아니오");
                  handleBlur(field);
                }}
                style={{
                  backgroundColor:
                    getNestedValue(patientInfo, field) === "아니오"
                      ? "#f44336"
                      : "#f1f1f1",
                  color:
                    getNestedValue(patientInfo, field) === "아니오"
                      ? "white"
                      : "black",
                }}
              >
                아니오
              </button>
            </div>
          </div>
        );

      case "yesNoWithText":
        // Ensure `reverse` has a default value of `false` if not provided
        const isYesSelected = getNestedValue(patientInfo, field) === "예";
        const isNoSelected = getNestedValue(patientInfo, field) === "아니오";
        const showSubFields =
          question.reverse ?? false ? isNoSelected : isYesSelected;

        return (
          <div className={styles.infoItem}>
            <label className={styles.label}>{label}</label>
            <div className={styles.yesNoContainer}>
              <button
                className={`${styles.yesNoButton} ${
                  isYesSelected ? styles.active : ""
                }`}
                onClick={() => {
                  handleInputChange(field, "예");
                  handleBlur(field);
                }}
                style={{
                  backgroundColor: isYesSelected ? "#4caf50" : "#f1f1f1",
                  color: isYesSelected ? "white" : "black",
                }}
              >
                예
              </button>
              <button
                className={`${styles.yesNoButton} ${
                  isNoSelected ? styles.active : ""
                }`}
                onClick={() => {
                  handleInputChange(field, "아니오");
                  handleBlur(field);
                }}
                style={{
                  backgroundColor: isNoSelected ? "#f44336" : "#f1f1f1",
                  color: isNoSelected ? "white" : "black",
                }}
              >
                아니오
              </button>
            </div>
            {showSubFields &&
              subFields?.map((subField, index) => (
                <div key={index} className={styles.subField}>
                  <label className={styles.subFieldLabel}>
                    {subField.label}
                  </label>
                  <input
                    type="text"
                    value={getNestedValue(patientInfo, subField.field) || ""}
                    onChange={(e) => {
                      handleInputChange(subField.field, e.target.value);
                    }}
                    onBlur={() => handleBlur(subField.field)}
                    className={styles.inputField}
                    placeholder="내용을 입력하세요"
                  />
                </div>
              ))}
          </div>
        );

      case "yesNoWithSingleCheckbox":
        // Use distinct variable names for this case
        const isYesSelectedForSingleCheckbox =
          getNestedValue(patientInfo, field) === "예";
        const isNoSelectedForSingleCheckbox =
          getNestedValue(patientInfo, field) === "아니오";
        const shouldShowOptions = isYesSelectedForSingleCheckbox;
        const shouldShowTextInput =
          isYesSelectedForSingleCheckbox && !question.reverse; // 텍스트 필드는 reverse가 false일 때만 보임

        return (
          <div className={styles.infoItem}>
            <label className={styles.label}>{label}</label>
            <div className={styles.yesNoContainer}>
              <button
                className={`${styles.yesNoButton} ${
                  isYesSelectedForSingleCheckbox ? styles.active : ""
                }`}
                onClick={() => {
                  handleInputChange(field, "예");
                  handleBlur(field);
                }}
                style={{
                  backgroundColor: isYesSelectedForSingleCheckbox
                    ? "#4caf50"
                    : "#f1f1f1",
                  color: isYesSelectedForSingleCheckbox ? "white" : "black",
                }}
              >
                예
              </button>
              <button
                className={`${styles.yesNoButton} ${
                  isNoSelectedForSingleCheckbox ? styles.active : ""
                }`}
                onClick={() => {
                  handleInputChange(field, "아니오");
                  handleBlur(field);
                }}
                style={{
                  backgroundColor: isNoSelectedForSingleCheckbox
                    ? "#f44336"
                    : "#f1f1f1",
                  color: isNoSelectedForSingleCheckbox ? "white" : "black",
                }}
              >
                아니오
              </button>
            </div>
            {shouldShowOptions && question.optionsField && (
              <div className={styles.checkboxContainer}>
                {question.optionsField.option.map((option, index) => (
                  <label key={index} className={styles.checkboxLabel}>
                    <input
                      type="radio"
                      name={`${field}_frequency`}
                      checked={
                        getNestedValue(
                          patientInfo,
                          question.optionsField.field
                        ) === option
                      }
                      onChange={() => {
                        handleInputChange(question.optionsField.field, option);
                        handleBlur(question.optionsField.field);
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            {shouldShowTextInput &&
              subFields?.map((subField, index) => (
                <div key={index} className={styles.subField}>
                  <label className={styles.subFieldLabel}>
                    {subField.label}
                  </label>
                  <input
                    type="text"
                    value={getNestedValue(patientInfo, subField.field) || ""}
                    onChange={(e) =>
                      handleInputChange(subField.field, e.target.value)
                    }
                    onBlur={() => handleBlur(subField.field)}
                    className={styles.inputField}
                    placeholder="내용을 입력하세요"
                  />
                </div>
              ))}
          </div>
        );

      case "multipleText":
        return (
          <div className={styles.infoItem}>
            <label className={styles.label}>{label}</label>
            <div className={styles.multipleTextContainer}>
              {Array.from({ length: question.count || 1 }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  value={getNestedValue(patientInfo, `${field}.${index}`) || ""}
                  onChange={(e) => {
                    const newValues = [
                      ...(getNestedValue(patientInfo, field) || []),
                    ];
                    newValues[index] = e.target.value;
                    handleInputChange(field, newValues);
                  }}
                  onBlur={() => handleBlur(field)}
                  className={styles.inputField}
                  placeholder={`약사 ${index + 1}`}
                />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // 질문 목록
  const questions: Question[] = [
    { label: "참여자 성명", field: "personal_info.name", type: "text" },
    { label: "생년월일", field: "personal_info.date_of_birth", type: "text" },
    { label: "연락처", field: "personal_info.phone_number", type: "text" },
    {
      label: "의료보장형태",
      field: "consultation_info.insurance_type",
      type: "radio",
      options: ["건강보험", "의료급여", "보훈", "비급여"],
    },
    {
      label: "최초 상담일",
      field: "consultation_info.initial_consult_date",
      type: "text",
    },
    {
      label: "상담일",
      field: "consultation_info.current_consult_date",
      type: "text",
    },
    {
      label: "상담 차수",
      field: "consultation_info.consult_session_number",
      type: "text",
    },
    {
      label: "상담 약사",
      field: "consultation_info.pharmacist_names",
      type: "multipleText",
      count: 3,
    },
    {
      label: "앓고 있는 질병",
      field: "medical_conditions.chronic_diseases.disease_names",
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
    {
      label: "기타",
      field: "medical_conditions.chronic_diseases.additional_info",
      type: "text",
    },
    {
      label: "과거 질병 및 수술 이력",
      field: "medical_conditions.medical_history",
      type: "text",
    },
    {
      label: "주요 불편한 증상",
      field: "medical_conditions.symptoms",
      type: "text",
    },
    {
      label: "알러지",
      field: "medical_conditions.allergies.has_allergies",
      type: "yesNoWithText",
      subFields: [
        {
          label: "알레르기 의심 식품 또는 약물",
          field: "medical_conditions.allergies.suspected_items",
        },
      ],
    },
    {
      label: "약물 부작용",
      field:
        "medical_conditions.adverse_drug_reactions.has_adverse_drug_reactions",
      type: "yesNoWithText",
      subFields: [
        {
          label: "부작용 의심 약물",
          field:
            "medical_conditions.adverse_drug_reactions.suspected_medications",
        },
        {
          label: "부작용 증상",
          field: "medical_conditions.adverse_drug_reactions.reaction_details",
        },
      ],
    },
    {
      label: "흡연",
      field: "lifestyle.smoking.is_smoking",
      type: "yesNoWithText",
      subFields: [
        {
          label: "흡연 기간 (년)",
          field: "lifestyle.smoking.duration_in_years",
        },
        { label: "평균 흡연량 (갑)", field: "lifestyle.smoking.pack_per_day" },
      ],
    },
    {
      label: "음주",
      field: "lifestyle.alcohol.is_drinking",
      type: "yesNoWithText",
      subFields: [
        { label: "음주 횟수 (주)", field: "lifestyle.alcohol.drinks_per_week" },
        {
          label: "1회 음주량 (병)",
          field: "lifestyle.alcohol.amount_per_drink",
        },
      ],
    },
    {
      label: "일주일에 30분 이상 운동을 하십니까?",
      field: "lifestyle.exercise.is_exercising",
      type: "yesNoWithSingleCheckbox",
      optionsField: {
        option: ["주 1회", "주 2회", "주 3회", "주 4회 이상"],
        field: "lifestyle.exercise.exercise_frequency",
      },
      reverse: false,
      subFields: [
        {
          label: "규칙적으로 하는 운동 종류",
          field: "lifestyle.exercise.exercise_types",
        },
      ],
    },
    {
      label: "매일 규칙적이고 균형 잡힌 식사를 하십니까?",
      field: "lifestyle.diet.is_balanced_meal",
      type: "yesNoWithSingleCheckbox",
      optionsField: {
        option: ["하루 1회", "하루 2회", "하루 3회"],
        field: "lifestyle.diet.balanced_meals_per_day",
      },
      reverse: true,
    },
    {
      label: "독거 여부",
      field: "medication_management.living_condition.living_alone",
      type: "yesNoWithText",
      reverse: true,
      subFields: [
        {
          label: "동거 가족구성원",
          field: "medication_management.living_condition.family_members",
        },
      ],
    },
    {
      label:
        "주로 약을 챙겨먹는 사람이 누구입니까? (투약보조자 유무 판별 질문)",
      field: "medication_management.living_condition.medication_assistants",
      type: "multiCheckboxWithOther",
      options: [
        "본인",
        "배우자",
        "자녀",
        "친인척",
        "친구",
        "요양보호사 또는 돌봄종사자",
      ],
    },
    {
      label: "가정 내 별도의 약 보관 장소가 있습니까?",
      field: "medication_management.medication_storage.has_medication_storage",
      type: "yesNoWithText",
      subFields: [
        {
          label: "보관 장소",
          field: "medication_management.medication_storage.location",
        },
      ],
    },
    {
      label: "만일을 위해 처방전/설명서를 보관합니까?",
      field:
        "medication_management.prescription_storage.is_prescription_stored",
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

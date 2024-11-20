import React from "react";
import debounce from "lodash/debounce";
import styles from "./PersonalInfoSection.module.css";
import { useState, useEffect, useCallback } from "react";

interface PersonalInfoSectionProps {
  patientInfo: any;
  setPatientInfo: React.Dispatch<React.SetStateAction<any>>;
  sessionId: string;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  patientInfo,
  setPatientInfo,
  sessionId,
}) => {
  const [lastBlurredValue, setLastBlurredValue] = useState({}); // 직전 값 저장 (변경 시에만 blur함수 작동할 수 있도록)

  useEffect(() => {
    if (
      Object.keys(lastBlurredValue).length === 0 &&
      Object.keys(patientInfo).length > 0
    ) {
      setLastBlurredValue(patientInfo); // patientInfo가 초기화된 이후에 설정
      console.log("Initialized lastBlurredValue with patientInfo");
    }
  }, [patientInfo]);

  // 경로를 올바르게 생성하는 함수
  const constructFieldPath = (baseField: string, subField?: string) => {
    return subField ? `${baseField}.${subField}` : baseField;
  };

  // 중첩된 필드 값을 안전하게 업데이트하는 함수
  function updateNestedField(obj: any, path: string, value: any) {
    const keys = path.split(".");
    const newObj = { ...obj }; // 최상위 객체의 얕은 복사

    let current = newObj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];

      // 중첩된 객체가 있으면 복사, 없으면 새 객체 생성
      current[key] = current[key] ? { ...current[key] } : {};
      current = current[key];
    }

    // 마지막 키에 새 값을 설정
    current[keys[keys.length - 1]] = value;

    return newObj; // 최상위 복사본 반환
  }

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
    console.log(newValue, previousValue);
    if (newValue === previousValue) {
      console.log("No changes detected, skipping PATCH request.");
      return;
    }

    const updatedField = {
      [fieldPath]: getNestedValue(patientInfo, fieldPath),
    };
    console.log("Field updated:", JSON.stringify(updatedField));

    // 변경 사항을 debounce로 전달
    debouncedPatch(updatedField);

    setLastBlurredValue((prev) =>
      updateNestedField({ ...prev }, fieldPath, newValue)
    );
    console.log("updated lastblurred value");
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
          console.log("Data updated successfully:", data);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    }, 1000),
    []
  );

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>환자 상세 정보</h3>
      <div className={styles.infoItem}>
        <label className={styles.label}>참여자 성명</label>
        <input
          type="text"
          value={patientInfo.personal_info?.name || ""}
          onChange={(e) =>
            handleInputChange("personal_info.name", e.target.value)
          }
          onBlur={() => handleBlur("personal_info.name")}
          className={styles.inputField}
          placeholder="내용을 입력하세요"
        />
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>생년월일</label>
        <input
          type="text"
          value={patientInfo.personal_info?.date_of_birth || ""}
          onChange={(e) =>
            handleInputChange("personal_info.date_of_birth", e.target.value)
          }
          onBlur={() => handleBlur("personal_info.date_of_birth")}
          className={styles.inputField}
          placeholder="내용을 입력하세요"
        />
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>연락처</label>
        <input
          type="text"
          value={patientInfo.personal_info?.phone_number || ""}
          onChange={(e) =>
            handleInputChange("personal_info.phone_number", e.target.value)
          }
          onBlur={() => handleBlur("personal_info.phone_number")}
          className={styles.inputField}
          placeholder="내용을 입력하세요"
        />
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>의료보장형태</label>
        <div className={styles.radioContainer}>
          {["건강보험", "의료급여", "보훈", "비급여"].map((option, index) => (
            <label key={index} className={styles.radioLabel}>
              <input
                type="radio"
                name="consultation_info.insurance_type"
                value={option}
                checked={
                  patientInfo.consultation_info?.insurance_type === option
                }
                onChange={() => {
                  handleInputChange("consultation_info.insurance_type", option);
                  handleBlur("consultation_info.insurance_type");
                }}
                className={styles.radioInput}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>최초 상담일</label>
        <input
          type="text"
          value={patientInfo.consultation_info?.initial_consult_date || ""}
          onChange={(e) =>
            handleInputChange(
              "consultation_info.initial_consult_date",
              e.target.value
            )
          }
          onBlur={() => handleBlur("consultation_info.initial_consult_date")}
          className={styles.inputField}
          placeholder="내용을 입력하세요"
        />
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>상담일</label>
        <input
          type="text"
          value={patientInfo.consultation_info?.current_consult_date || ""}
          onChange={(e) =>
            handleInputChange(
              "consultation_info.current_consult_date",
              e.target.value
            )
          }
          onBlur={() => handleBlur("consultation_info.current_consult_date")}
          className={styles.inputField}
          placeholder="내용을 입력하세요"
        />
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>상담 차수</label>
        <input
          type="text"
          value={patientInfo.consultation_info?.consult_session_number || ""}
          onChange={(e) =>
            handleInputChange(
              "consultation_info.consult_session_number",
              e.target.value
            )
          }
          onBlur={() => handleBlur("consultation_info.consult_session_number")}
          className={styles.inputField}
          placeholder="내용을 입력하세요"
        />
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>상담 약사</label>
        {Array.from({ length: 3 }).map((_, index) => (
          <input
            key={index}
            type="text"
            value={
              patientInfo.consultation_info?.pharmacist_names?.[index] || ""
            }
            onChange={(e) => {
              const newValues = [
                ...(patientInfo.consultation_info?.pharmacist_names || []),
              ];
              newValues[index] = e.target.value;
              handleInputChange(
                "consultation_info.pharmacist_names",
                newValues
              );
            }}
            onBlur={() => handleBlur("consultation_info.pharmacist_names")}
            className={styles.inputField}
            placeholder={`약사 ${index + 1}`}
          />
        ))}
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>앓고 있는 질병</label>
        <div className={styles.checkboxContainer}>
          {[
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
          ].map((option, index) => (
            <label key={index} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={
                  patientInfo.medical_conditions?.chronic_diseases?.disease_names?.includes(
                    option
                  ) || false
                }
                onChange={(e) => {
                  const selectedOptions =
                    patientInfo.medical_conditions?.chronic_diseases
                      ?.disease_names || [];
                  if (e.target.checked) {
                    handleInputChange(
                      "medical_conditions.chronic_diseases.disease_names",
                      [...selectedOptions, option]
                    );
                  } else {
                    handleInputChange(
                      "medical_conditions.chronic_diseases.disease_names",
                      selectedOptions.filter((item) => item !== option)
                    );
                  }
                  handleBlur(
                    "medical_conditions.chronic_diseases.disease_names"
                  );
                }}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>기타</label>
        <input
          type="text"
          value={
            patientInfo.medical_conditions?.chronic_diseases?.additional_info ||
            ""
          }
          onChange={(e) =>
            handleInputChange(
              "medical_conditions.chronic_diseases.additional_info",
              e.target.value
            )
          }
          onBlur={() =>
            handleBlur("medical_conditions.chronic_diseases.additional_info")
          }
          className={styles.inputField}
          placeholder="내용을 입력하세요"
        />
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>과거 질병 및 수술 이력</label>
        <input
          type="text"
          value={patientInfo.medical_conditions?.medical_history || ""}
          onChange={(e) =>
            handleInputChange(
              "medical_conditions.medical_history",
              e.target.value
            )
          }
          onBlur={() => handleBlur("medical_conditions.medical_history")}
          className={styles.inputField}
          placeholder="내용을 입력하세요"
        />
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>주요 불편한 증상</label>
        <input
          type="text"
          value={patientInfo.medical_conditions?.symptoms || ""}
          onChange={(e) =>
            handleInputChange("medical_conditions.symptoms", e.target.value)
          }
          onBlur={() => handleBlur("medical_conditions.symptoms")}
          className={styles.inputField}
          placeholder="내용을 입력하세요"
        />
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>알러지 여부</label>
        <div className={styles.yesNoContainer}>
          <button
            className={`${styles.yesNoButton} ${
              patientInfo.medical_conditions?.allergies?.has_allergies === "예"
                ? styles.active
                : ""
            }`}
            onClick={() => {
              handleInputChange(
                "medical_conditions.allergies.has_allergies",
                "예"
              );
              handleBlur("medical_conditions.allergies.has_allergies");
            }}
          >
            예
          </button>
          <button
            className={`${styles.yesNoButton} ${
              patientInfo.medical_conditions?.allergies?.has_allergies ===
              "아니오"
                ? styles.active
                : ""
            }`}
            onClick={() => {
              handleInputChange(
                "medical_conditions.allergies.has_allergies",
                "아니오"
              );
              handleBlur("medical_conditions.allergies.has_allergies");
            }}
          >
            아니오
          </button>
        </div>
        {patientInfo.medical_conditions?.allergies?.has_allergies === "예" && (
          <div className={styles.subField}>
            <label className={styles.subFieldLabel}>
              알레르기 의심 식품 또는 약물
            </label>
            <input
              type="text"
              value={
                patientInfo.medical_conditions?.allergies?.suspected_items || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "medical_conditions.allergies.suspected_items",
                  e.target.value
                )
              }
              onBlur={() =>
                handleBlur("medical_conditions.allergies.suspected_items")
              }
              className={styles.inputField}
              placeholder="내용을 입력하세요"
            />
          </div>
        )}
        <div className={styles.infoItem}>
          <label className={styles.label}>약물 부작용 여부</label>
          <div className={styles.yesNoContainer}>
            <button
              className={`${styles.yesNoButton} ${
                patientInfo.medical_conditions?.adverse_drug_reactions
                  ?.has_adverse_drug_reactions === "예"
                  ? styles.active
                  : ""
              }`}
              onClick={() => {
                handleInputChange(
                  "medical_conditions.adverse_drug_reactions.has_adverse_drug_reactions",
                  "예"
                );
                handleBlur(
                  "medical_conditions.adverse_drug_reactions.has_adverse_drug_reactions"
                );
              }}
            >
              예
            </button>
            <button
              className={`${styles.yesNoButton} ${
                patientInfo.medical_conditions?.adverse_drug_reactions
                  ?.has_adverse_drug_reactions === "아니오"
                  ? styles.active
                  : ""
              }`}
              onClick={() => {
                handleInputChange(
                  "medical_conditions.adverse_drug_reactions.has_adverse_drug_reactions",
                  "아니오"
                );
                handleBlur(
                  "medical_conditions.adverse_drug_reactions.has_adverse_drug_reactions"
                );
              }}
            >
              아니오
            </button>
          </div>
          {patientInfo.medical_conditions?.adverse_drug_reactions
            ?.has_adverse_drug_reactions === "예" && (
            <div className={styles.subField}>
              <label className={styles.subFieldLabel}>부작용 의심 약물</label>
              <input
                type="text"
                value={
                  patientInfo.medical_conditions?.adverse_drug_reactions
                    ?.suspected_medications || ""
                }
                onChange={(e) =>
                  handleInputChange(
                    "medical_conditions.adverse_drug_reactions.suspected_medications",
                    e.target.value
                  )
                }
                onBlur={() =>
                  handleBlur(
                    "medical_conditions.adverse_drug_reactions.suspected_medications"
                  )
                }
                className={styles.inputField}
                placeholder="내용을 입력하세요"
              />
              <div className={styles.subField}>
                <label className={styles.subFieldLabel}>부작용 증상</label>
                <input
                  type="text"
                  value={
                    patientInfo.medical_conditions?.adverse_drug_reactions
                      ?.reaction_details || ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "medical_conditions.adverse_drug_reactions.reaction_details",
                      e.target.value
                    )
                  }
                  onBlur={() =>
                    handleBlur(
                      "medical_conditions.adverse_drug_reactions.reaction_details"
                    )
                  }
                  className={styles.inputField}
                  placeholder="부작용 증상을 입력하세요"
                />
              </div>
            </div>
          )}
        </div>
        <div className={styles.infoItem}>
          <label className={styles.label}>흡연 여부</label>
          <div className={styles.yesNoContainer}>
            <button
              className={`${styles.yesNoButton} ${
                patientInfo.lifestyle?.smoking?.is_smoking === "예"
                  ? styles.active
                  : ""
              }`}
              onClick={() => {
                handleInputChange("lifestyle.smoking.is_smoking", "예");
                handleBlur("lifestyle.smoking.is_smoking");
              }}
            >
              예
            </button>
            <button
              className={`${styles.yesNoButton} ${
                patientInfo.lifestyle?.smoking?.is_smoking === "아니오"
                  ? styles.active
                  : ""
              }`}
              onClick={() => {
                handleInputChange("lifestyle.smoking.is_smoking", "아니오");
                handleBlur("lifestyle.smoking.is_smoking");
              }}
            >
              아니오
            </button>
          </div>
          {patientInfo.lifestyle?.smoking?.is_smoking === "예" && (
            <div className={styles.subField}>
              <label className={styles.subFieldLabel}>흡연 기간 (년)</label>
              <input
                type="text"
                value={patientInfo.lifestyle?.smoking?.duration_in_years || ""}
                onChange={(e) =>
                  handleInputChange(
                    "lifestyle.smoking.duration_in_years",
                    e.target.value
                  )
                }
                onBlur={() => handleBlur("lifestyle.smoking.duration_in_years")}
                className={styles.inputField}
                placeholder="내용을 입력하세요"
              />
              <div className={styles.subField}>
                <label className={styles.subFieldLabel}>평균 흡연량 (갑)</label>
                <input
                  type="text"
                  value={patientInfo.lifestyle?.smoking?.pack_per_day || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "lifestyle.smoking.pack_per_day",
                      e.target.value
                    )
                  }
                  onBlur={() => handleBlur("lifestyle.smoking.pack_per_day")}
                  className={styles.inputField}
                  placeholder="내용을 입력하세요"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>음주 여부</label>
        <div className={styles.yesNoContainer}>
          <button
            className={`${styles.yesNoButton} ${
              patientInfo.lifestyle?.alcohol?.is_drinking === "예"
                ? styles.active
                : ""
            }`}
            onClick={() => {
              handleInputChange("lifestyle.alcohol.is_drinking", "예");
              handleBlur("lifestyle.alcohol.is_drinking");
            }}
          >
            예
          </button>
          <button
            className={`${styles.yesNoButton} ${
              patientInfo.lifestyle?.alcohol?.is_drinking === "아니오"
                ? styles.active
                : ""
            }`}
            onClick={() => {
              handleInputChange("lifestyle.alcohol.is_drinking", "아니오");
              handleBlur("lifestyle.alcohol.is_drinking");
            }}
          >
            아니오
          </button>
        </div>
        {patientInfo.lifestyle?.alcohol?.is_drinking === "예" && (
          <div className={styles.subField}>
            <label className={styles.subFieldLabel}>음주 횟수 (주)</label>
            <input
              type="text"
              value={patientInfo.lifestyle?.alcohol?.drinks_per_week || ""}
              onChange={(e) =>
                handleInputChange(
                  "lifestyle.alcohol.drinks_per_week",
                  e.target.value
                )
              }
              onBlur={() => handleBlur("lifestyle.alcohol.drinks_per_week")}
              className={styles.inputField}
              placeholder="내용을 입력하세요"
            />
            <div className={styles.subField}>
              <label className={styles.subFieldLabel}>1회 음주량 (병)</label>
              <input
                type="text"
                value={patientInfo.lifestyle?.alcohol?.amount_per_drink || ""}
                onChange={(e) =>
                  handleInputChange(
                    "lifestyle.alcohol.amount_per_drink",
                    e.target.value
                  )
                }
                onBlur={() => handleBlur("lifestyle.alcohol.amount_per_drink")}
                className={styles.inputField}
                placeholder="내용을 입력하세요"
              />
            </div>
          </div>
        )}
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>운동 여부</label>
        <div className={styles.yesNoContainer}>
          <button
            className={`${styles.yesNoButton} ${
              patientInfo.lifestyle?.exercise?.is_exercising === "예"
                ? styles.active
                : ""
            }`}
            onClick={() => {
              handleInputChange("lifestyle.exercise.is_exercising", "예");
              handleBlur("lifestyle.exercise.is_exercising");
            }}
          >
            예
          </button>
          <button
            className={`${styles.yesNoButton} ${
              patientInfo.lifestyle?.exercise?.is_exercising === "아니오"
                ? styles.active
                : ""
            }`}
            onClick={() => {
              handleInputChange("lifestyle.exercise.is_exercising", "아니오");
              handleBlur("lifestyle.exercise.is_exercising");
            }}
          >
            아니오
          </button>
        </div>
        {patientInfo.lifestyle?.exercise?.is_exercising === "예" && (
          <div className={styles.subField}>
            <label className={styles.subFieldLabel}>주당 운동 빈도</label>
            <input
              type="text"
              value={patientInfo.lifestyle?.exercise?.exercise_frequency || ""}
              onChange={(e) =>
                handleInputChange(
                  "lifestyle.exercise.exercise_frequency",
                  e.target.value
                )
              }
              onBlur={() => handleBlur("lifestyle.exercise.exercise_frequency")}
              className={styles.inputField}
              placeholder="내용을 입력하세요"
            />
            <div className={styles.subField}>
              <label className={styles.subFieldLabel}>운동 종류</label>
              <input
                type="text"
                value={patientInfo.lifestyle?.exercise?.exercise_types || ""}
                onChange={(e) =>
                  handleInputChange(
                    "lifestyle.exercise.exercise_types",
                    e.target.value
                  )
                }
                onBlur={() => handleBlur("lifestyle.exercise.exercise_types")}
                className={styles.inputField}
                placeholder="운동 종류를 입력하세요"
              />
            </div>
          </div>
        )}
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>균형 잡힌 식사 여부</label>
        <div className={styles.yesNoContainer}>
          <button
            className={`${styles.yesNoButton} ${
              patientInfo.lifestyle?.diet?.is_balanced_meal === "예"
                ? styles.active
                : ""
            }`}
            onClick={() => {
              handleInputChange("lifestyle.diet.is_balanced_meal", "예");
              handleBlur("lifestyle.diet.is_balanced_meal");
            }}
          >
            예
          </button>
          <button
            className={`${styles.yesNoButton} ${
              patientInfo.lifestyle?.diet?.is_balanced_meal === "아니오"
                ? styles.active
                : ""
            }`}
            onClick={() => {
              handleInputChange("lifestyle.diet.is_balanced_meal", "아니오");
              handleBlur("lifestyle.diet.is_balanced_meal");
            }}
          >
            아니오
          </button>
        </div>
        {patientInfo.lifestyle?.diet?.is_balanced_meal === "예" && (
          <div className={styles.subField}>
            <label className={styles.subFieldLabel}>하루 식사 횟수</label>
            <input
              type="text"
              value={patientInfo.lifestyle?.diet?.meals_per_day || ""}
              onChange={(e) =>
                handleInputChange(
                  "lifestyle.diet.meals_per_day",
                  e.target.value
                )
              }
              onBlur={() => handleBlur("lifestyle.diet.meals_per_day")}
              className={styles.inputField}
              placeholder="식사 횟수를 입력하세요"
            />
          </div>
        )}
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>독거 여부</label>
        <div className={styles.yesNoContainer}>
          <button
            className={`${styles.yesNoButton} ${
              patientInfo.medication_management?.living_condition
                ?.living_alone === "예"
                ? styles.active
                : ""
            }`}
            onClick={() => {
              handleInputChange(
                "medication_management.living_condition.living_alone",
                "예"
              );
              handleBlur("medication_management.living_condition.living_alone");
            }}
          >
            예
          </button>
          <button
            className={`${styles.yesNoButton} ${
              patientInfo.medication_management?.living_condition
                ?.living_alone === "아니오"
                ? styles.active
                : ""
            }`}
            onClick={() => {
              handleInputChange(
                "medication_management.living_condition.living_alone",
                "아니오"
              );
              handleBlur("medication_management.living_condition.living_alone");
            }}
          >
            아니오
          </button>
        </div>
        {patientInfo.medication_management?.living_condition?.living_alone ===
          "아니오" && (
          <div className={styles.subField}>
            <label className={styles.subFieldLabel}>동거 가족구성원</label>
            <input
              type="text"
              value={
                patientInfo.medication_management?.living_condition
                  ?.family_members || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "medication_management.living_condition.family_members",
                  e.target.value
                )
              }
              onBlur={() =>
                handleBlur(
                  "medication_management.living_condition.family_members"
                )
              }
              className={styles.inputField}
              placeholder="동거 가족구성원을 입력하세요"
            />
          </div>
        )}
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>투약 보조자 여부</label>
        <div className={styles.checkboxContainer}>
          {[
            "본인",
            "배우자",
            "자녀",
            "친인척",
            "친구",
            "요양보호사 또는 돌봄종사자",
          ].map((option, index) => (
            <label key={index} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={
                  patientInfo.medication_management?.living_condition?.medication_assistants?.includes(
                    option
                  ) || false
                }
                onChange={(e) => {
                  const selectedOptions =
                    patientInfo.medication_management?.living_condition
                      ?.medication_assistants || [];
                  if (e.target.checked) {
                    handleInputChange(
                      "medication_management.living_condition.medication_assistants",
                      [...selectedOptions, option]
                    );
                  } else {
                    handleInputChange(
                      "medication_management.living_condition.medication_assistants",
                      selectedOptions.filter((item) => item !== option)
                    );
                  }
                  handleBlur(
                    "medication_management.living_condition.medication_assistants"
                  );
                }}
              />
              {option}
            </label>
          ))}
        </div>
        <div className={styles.subField}>
          <label className={styles.subFieldLabel}>기타 (직접 입력)</label>
          <input
            type="text"
            value={
              patientInfo.medication_management?.living_condition
                ?.other_medication_assistant || ""
            }
            onChange={(e) =>
              handleInputChange(
                "medication_management.living_condition.other_medication_assistant",
                e.target.value
              )
            }
            onBlur={() =>
              handleBlur(
                "medication_management.living_condition.other_medication_assistant"
              )
            }
            className={styles.inputField}
            placeholder="기타 투약 보조자를 입력하세요"
          />
        </div>
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>약 보관 장소 여부</label>
        <div className={styles.yesNoContainer}>
          <button
            className={`${styles.yesNoButton} ${
              patientInfo.medication_management?.medication_storage
                ?.has_medication_storage === "예"
                ? styles.active
                : ""
            }`}
            onClick={() => {
              handleInputChange(
                "medication_management.medication_storage.has_medication_storage",
                "예"
              );
              handleBlur(
                "medication_management.medication_storage.has_medication_storage"
              );
            }}
          >
            예
          </button>
          <button
            className={`${styles.yesNoButton} ${
              patientInfo.medication_management?.medication_storage
                ?.has_medication_storage === "아니오"
                ? styles.active
                : ""
            }`}
            onClick={() => {
              handleInputChange(
                "medication_management.medication_storage.has_medication_storage",
                "아니오"
              );
              handleBlur(
                "medication_management.medication_storage.has_medication_storage"
              );
            }}
          >
            아니오
          </button>
        </div>
        {patientInfo.medication_management?.medication_storage
          ?.has_medication_storage === "예" && (
          <div className={styles.subField}>
            <label className={styles.subFieldLabel}>보관 장소</label>
            <input
              type="text"
              value={
                patientInfo.medication_management?.medication_storage
                  ?.location || ""
              }
              onChange={(e) =>
                handleInputChange(
                  "medication_management.medication_storage.location",
                  e.target.value
                )
              }
              onBlur={() =>
                handleBlur("medication_management.medication_storage.location")
              }
              className={styles.inputField}
              placeholder="보관 장소를 입력하세요"
            />
          </div>
        )}
      </div>
      <div className={styles.infoItem}>
        <label className={styles.label}>처방전/설명서 보관 여부</label>
        <div className={styles.yesNoContainer}>
          <button
            className={`${styles.yesNoButton} ${
              patientInfo.medication_management?.prescription_storage
                ?.is_prescription_stored === "예"
                ? styles.active
                : ""
            }`}
            onClick={() => {
              handleInputChange(
                "medication_management.prescription_storage.is_prescription_stored",
                "예"
              );
              handleBlur(
                "medication_management.prescription_storage.is_prescription_stored"
              );
            }}
          >
            예
          </button>
          <button
            className={`${styles.yesNoButton} ${
              patientInfo.medication_management?.prescription_storage
                ?.is_prescription_stored === "아니오"
                ? styles.active
                : ""
            }`}
            onClick={() => {
              handleInputChange(
                "medication_management.prescription_storage.is_prescription_stored",
                "아니오"
              );
              handleBlur(
                "medication_management.prescription_storage.is_prescription_stored"
              );
            }}
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;

import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import styles from "./PrescriptionDrugsSection.module.css";

interface PrescriptionDrug {
  name: string;
  days: string;
  purpose: string;
  status: string;
}

interface Supplement {
  name: string;
  unit: string;
  purpose: string;
  status: string;
}

interface MedicationList {
  current_medications: {
    ethical_the_counter_drugs: {
      count: number;
      list: PrescriptionDrug[];
    };
    over_the_counter_drugs: {
      count: number;
      list: Supplement[];
    };
    health_functional_foods: {
      count: number;
      list: Supplement[];
    };
  };
}

interface Props {
  medicationList: MedicationList;
  setMedicationList: (updatedList: MedicationList) => void;
  sessionId: string;
}

const PrescriptionDrugsSection: React.FC<Props> = ({
  medicationList,
  setMedicationList,
  sessionId,
}) => {
  const [drugs, setDrugs] = useState<PrescriptionDrug[]>([]);
  const [newDrug, setNewDrug] = useState<PrescriptionDrug>({
    name: "",
    days: "",
    purpose: "",
    status: "상시 복용",
  });

  // Load the ethical_the_counter_drugs list into state
  useEffect(() => {
    setDrugs(medicationList.current_medications.ethical_the_counter_drugs.list);
  }, [medicationList]);

  const handleAddDrug = () => {
    if (newDrug.name) {
      const updatedDrugs = [...drugs, newDrug];
      const updatedList = {
        ...medicationList,
        current_medications: {
          ...medicationList.current_medications,
          ethical_the_counter_drugs: {
            count: updatedDrugs.length,
            list: updatedDrugs,
          },
        },
      };

      // Update the state using setMedicationList
      setMedicationList(updatedList);
      setDrugs(updatedDrugs);
      setNewDrug({ name: "", days: "", purpose: "", status: "상시 복용" });

      // Make the PATCH request to update the server
      fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_medications: {
            ethical_the_counter_drugs: {
              count: updatedDrugs.length,
              list: updatedDrugs,
            },
          },
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update data");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Data updated successfully:", data.temp);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    }
  };

  const handleDeleteDrug = (index: number) => {
    const updatedDrugs = drugs.filter((_, i) => i !== index);
    const updatedList = {
      ...medicationList,
      current_medications: {
        ...medicationList.current_medications,
        ethical_the_counter_drugs: {
          count: updatedDrugs.length,
          list: updatedDrugs,
        },
      },
    };

    // Update the state using setMedicationList
    setMedicationList(updatedList);
    setDrugs(updatedDrugs);

    // Make the PATCH request to update the server
    fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_medications: {
          ethical_the_counter_drugs: {
            count: updatedDrugs.length,
            list: updatedDrugs,
          },
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data updated successfully:", data.temp);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>처방 의약품</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>상품명</th>
            <th>처방 일수</th>
            <th>약물 사용 목적</th>
            <th>사용 상태</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {drugs.map((drug, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{drug.name}</td>
              {drug.days === "" ? <td></td> : <td>{drug.days}일</td>}
              <td>{drug.purpose}</td>
              <td>{drug.status}</td>
              <td>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteDrug(index)}
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="상품명"
          value={newDrug.name}
          onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })}
          className={styles.inputField}
        />
        <input
          type="number"
          placeholder="처방 일수"
          value={newDrug.days}
          onChange={(e) => setNewDrug({ ...newDrug, days: e.target.value })}
          className={styles.inputField}
        />
        <input
          type="text"
          placeholder="약물 사용 목적"
          value={newDrug.purpose}
          onChange={(e) => setNewDrug({ ...newDrug, purpose: e.target.value })}
          className={styles.inputField}
        />
        <select
          value={newDrug.status}
          onChange={(e) => setNewDrug({ ...newDrug, status: e.target.value })}
          className={styles.selectField}
        >
          <option value="상시 복용">상시 복용</option>
          <option value="필요 시 복용">필요 시 복용</option>
          <option value="복용 중단">복용 중단</option>
          <option value="기타">기타</option>
        </select>
        <button className={styles.addButton} onClick={handleAddDrug}>
          저장하기
        </button>
      </div>
    </div>
  );
};

export default PrescriptionDrugsSection;

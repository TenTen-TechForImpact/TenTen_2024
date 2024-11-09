import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import styles from "./supplementsSection.module.css";

interface Supplement {
  name: string;
  unit: string;
  purpose: string;
  status: string;
}

interface PrescriptionDrug {
  name: string;
  days: string;
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

const SupplementsSection: React.FC<Props> = ({
  medicationList,
  setMedicationList,
  sessionId,
}) => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);

  useEffect(() => {
    setSupplements(
      medicationList.current_medications.health_functional_foods.list
    );
  }, [medicationList]);

  const [newSupplement, setNewSupplement] = useState<Supplement>({
    name: "",
    unit: "",
    purpose: "",
    status: "상시 복용",
  });

  const handleAddSupplement = () => {
    if (newSupplement.name) {
      const updatedSupplements = [...supplements, newSupplement];
      const updatedList = {
        ...medicationList,
        current_medications: {
          ...medicationList.current_medications,
          health_functional_foods: {
            count: updatedSupplements.length,
            list: updatedSupplements,
          },
        },
      };

      setMedicationList(updatedList);
      setSupplements(updatedSupplements);
      setNewSupplement({
        name: "",
        unit: "",
        purpose: "",
        status: "상시 복용",
      });

      // Make the PATCH request to update the server
      fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_medications: {
            health_functional_foods: {
              count: updatedSupplements.length,
              list: updatedSupplements,
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
          console.log("Data updated successfully:", data);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
    }
  };

  const handleDeleteSupplement = (index: number) => {
    const updatedSupplements = supplements.filter((_, i) => i !== index);
    const updatedList = {
      ...medicationList,
      current_medications: {
        ...medicationList.current_medications,
        health_functional_foods: {
          count: updatedSupplements.length,
          list: updatedSupplements,
        },
      },
    };

    setMedicationList(updatedList);
    setSupplements(updatedSupplements);

    fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_medications: {
          health_functional_foods: {
            count: updatedSupplements.length,
            list: updatedSupplements,
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
        console.log("Data updated successfully:", data);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>건강기능식품</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>상품명</th>
            <th>제품 단위</th>
            <th>약물 사용 목적</th>
            <th>사용 상태</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {supplements.map((supplement, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{supplement.name}</td>
              <td>{supplement.unit}</td>
              <td>{supplement.purpose}</td>
              <td>{supplement.status}</td>
              <td>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteSupplement(index)}
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
          value={newSupplement.name}
          onChange={(e) =>
            setNewSupplement({ ...newSupplement, name: e.target.value })
          }
          className={styles.inputField}
        />
        <input
          type="text"
          placeholder="제품 단위"
          value={newSupplement.unit}
          onChange={(e) =>
            setNewSupplement({ ...newSupplement, unit: e.target.value })
          }
          className={styles.inputField}
        />
        <input
          type="text"
          placeholder="약물 사용 목적"
          value={newSupplement.purpose}
          onChange={(e) =>
            setNewSupplement({ ...newSupplement, purpose: e.target.value })
          }
          className={styles.inputField}
        />
        <select
          value={newSupplement.status}
          onChange={(e) =>
            setNewSupplement({ ...newSupplement, status: e.target.value })
          }
          className={styles.selectField}
        >
          <option value="상시 복용">상시 복용</option>
          <option value="필요 시 복용">필요 시 복용</option>
          <option value="복용 중단">복용 중단</option>
          <option value="기타">기타</option>
        </select>
        <button className={styles.addButton} onClick={handleAddSupplement}>
          저장하기
        </button>
      </div>
    </div>
  );
};

export default SupplementsSection;

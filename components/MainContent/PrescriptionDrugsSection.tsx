import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Select, Label } from "flowbite-react";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewDrug({ name: "", days: "", purpose: "", status: "상시 복용" });
  };

  return (
    <div>
      <h3 className={styles.sectionTitle}>처방 의약품</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>상품명</th>
            <th>처방 일수</th>
            <th>약물 사용 목적</th>
            <th>사용 상태</th>
            <th onClick={handleOpenModal} className={styles.addButton}>
              +
            </th>
          </tr>
        </thead>
        <tbody>
          {drugs.length > 0 ? (
            drugs.map((drug, index) => (
              <tr key={index}>
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
            ))
          ) : (
            <tr>
              <td colSpan={5} className={styles.emptyMessage}>
                '+'를 눌러 항목을 추가해주세요.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal show={isModalOpen} size="md" onClose={handleCloseModal}>
        <Modal.Header>약물 추가</Modal.Header>
        <Modal.Body>
          <div className={styles.inputContainer}>
            <Label htmlFor="drug-name" value="상품명" />
            <TextInput
              id="drug-name"
              placeholder="상품명"
              value={newDrug.name}
              onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })}
            />
            <Label htmlFor="drug-days" value="처방 일수" />
            <TextInput
              id="drug-days"
              type="number"
              placeholder="처방 일수"
              value={newDrug.days}
              onChange={(e) => setNewDrug({ ...newDrug, days: e.target.value })}
            />
            <Label htmlFor="drug-purpose" value="약물 사용 목적" />
            <TextInput
              id="drug-purpose"
              placeholder="약물 사용 목적"
              value={newDrug.purpose}
              onChange={(e) =>
                setNewDrug({ ...newDrug, purpose: e.target.value })
              }
            />
            <Label htmlFor="drug-status" value="사용 상태" />
            <Select
              id="drug-status"
              value={newDrug.status}
              onChange={(e) =>
                setNewDrug({ ...newDrug, status: e.target.value })
              }
            >
              <option value="상시 복용">상시 복용</option>
              <option value="필요 시 복용">필요 시 복용</option>
              <option value="복용 중단">복용 중단</option>
              <option value="기타">기타</option>
            </Select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className={styles.addButton}
            onClick={() => {
              handleAddDrug();
              setIsModalOpen(true); // Reset for consecutive input
            }}
          >
            추가
          </Button>
          <Button color="gray" onClick={handleCloseModal}>
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PrescriptionDrugsSection;

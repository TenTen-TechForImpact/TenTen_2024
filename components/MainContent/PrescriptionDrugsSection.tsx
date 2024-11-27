import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Table } from "flowbite-react"
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
      <div className={styles.tableContainer}>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>상품명</Table.HeadCell>
            <Table.HeadCell>처방 일수</Table.HeadCell>
            <Table.HeadCell>약물 사용 목적</Table.HeadCell>
            <Table.HeadCell>사용 상태</Table.HeadCell>
            <Table.HeadCell>삭제</Table.HeadCell>
          </Table.Head>
          <Table.Body className={styles.tableBody}>
            {drugs.map((drug, index) => (
              <Table.Row key={index} className={styles.tableRow}>
                <Table.Cell className="font-bold">{drug.name}</Table.Cell>
                <Table.Cell>{drug.days === "" ? "-" : `${drug.days}일`}</Table.Cell>
                <Table.Cell>{drug.purpose}</Table.Cell>
                <Table.Cell>{drug.status}</Table.Cell>
                <Table.Cell>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteDrug(index)}
                  >
                    <FaTrashAlt />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
            <Table.Row className={styles.inputRow}>
              <Table.Cell className={styles.inputCell}>
                <input
                  type="text"
                  placeholder="상품명"
                  value={newDrug.name}
                  onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })}
                  className={styles.inputField}
                />
              </Table.Cell>
              <Table.Cell>
                <input
                  type="number"
                  placeholder="처방 일수"
                  value={newDrug.days}
                  onChange={(e) => setNewDrug({ ...newDrug, days: e.target.value })}
                  className={styles.inputField}
                />
              </Table.Cell>
              <Table.Cell>
                <input
                  type="text"
                  placeholder="약물 사용 목적"
                  value={newDrug.purpose}
                  onChange={(e) => setNewDrug({ ...newDrug, purpose: e.target.value })}
                  className={styles.inputField}
                />
              </Table.Cell>
              <Table.Cell>
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
              </Table.Cell>
              <Table.Cell>
                <button className={styles.addButton} onClick={handleAddDrug}>
                  저장하기
                </button>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default PrescriptionDrugsSection;

// src/components/MainContent/OTCAndSupplementsSection.tsx
import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import styles from './OTCAndSupplementsSection.module.css';

interface OTCDrug {
  name: string;
  unit: string;
  purpose: string;
  status: string;
}

const OTCAndSupplementsSection: React.FC = () => {
  const [drugs, setDrugs] = useState<OTCDrug[]>([]);
  const [newDrug, setNewDrug] = useState<OTCDrug>({
    name: "",
    unit: "",
    purpose: "",
    status: "상시 복용",
  });

  const handleAddDrug = () => {
    if (newDrug.name && newDrug.purpose && newDrug.unit) {
      setDrugs([...drugs, newDrug]);
      setNewDrug({ name: "", unit: "", purpose: "", status: "상시 복용" });
    }
  };

  const handleDeleteDrug = (index: number) => {
    const updatedDrugs = drugs.filter((_, i) => i !== index);
    setDrugs(updatedDrugs);
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>일반의약품 + 건강기능식품</h3>
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
          {drugs.map((drug, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{drug.name}</td>
              <td>{drug.unit}</td>
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
          type="text"
          placeholder="제품 단위"
          value={newDrug.unit}
          onChange={(e) => setNewDrug({ ...newDrug, unit: e.target.value })}
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

export default OTCAndSupplementsSection;

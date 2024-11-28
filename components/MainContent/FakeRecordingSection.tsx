"use client";

import React from "react";
import { FaMicrophone } from "react-icons/fa";
import styles from "./FakeRecordingSection.module.css";

const FakeRecordingSection: React.FC = () => {
  const handleRecordClick = () => {
    alert("녹음 요약 기능은 공개 배포 버전에서 사용하실 수 없습니다.");
  };

  return (
    <div className={styles.fakeRecordingSection}>
      <h2 className={styles.title}>약사 상담 녹음</h2>
      <p className={styles.subtitle}>
        아래 버튼을 눌러 상담을 녹음합니다. 녹음 업로드 후, 자동 요약에 30초~1분
        가량이 소요될 수 있습니다.
      </p>
      <button className={styles.recordButton} onClick={handleRecordClick}>
        <FaMicrophone className={styles.icon} />
      </button>
    </div>
  );
};

export default FakeRecordingSection;

// MainPage.tsx - 메인 페이지 컴포넌트
// 전체 페이지 레이아웃과 환자 리스트 포함

import React from "react";
import Header from "./Header";
import PatientList from "./PatientList";
import styles from "./MainPage.module.css";

const MainPage: React.FC = () => {
  return (
    <div className={styles.mainPage}>
      <Header />
      <h1 className={styles.title}>늘품가치 약사님의 TenTen 페이지</h1>
      <PatientList />
    </div>
  );
};

export default MainPage;

// src/components/Sidebar/Sidebar.tsx

import React from "react";
import PatientInfoCard from "./PatientInfoCard";
import NavigationList from "./NavigationList";
import ConsultationSummary from "./ConsultationSummary";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  isFollowUp: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isFollowUp }) => {
  const patientInfo = {
    id: 1,
    name: "김철수",
    gender: "Male",
    birthDate: "1995-02-10",
    phoneNumber: "01012345678",
  };

  return (
    <aside className={styles.sidebar}>
      <PatientInfoCard patientInfo={patientInfo} />
      <NavigationList isFollowUp={isFollowUp} />
      {isFollowUp && <ConsultationSummary />}
    </aside>
  );
};

export default Sidebar;

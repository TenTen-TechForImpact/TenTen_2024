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
  return (
    <aside className={styles.sidebar}>
      <PatientInfoCard />
      <NavigationList isFirstSession={!isFollowUp} />
      {isFollowUp && <ConsultationSummary />}
    </aside>
  );
};

export default Sidebar;

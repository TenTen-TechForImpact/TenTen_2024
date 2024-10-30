"use client";

import React from "react";
import PatientCard from "./PatientCard";

const PatientList = ({ patients }) => {
  return (
    <div className="patients-wrapper">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
};

export default PatientList;

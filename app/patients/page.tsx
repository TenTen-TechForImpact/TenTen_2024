// app/patients/[id]/page.tsx

import React from "react";
import MainPage from "../../app/MainPage";

const PatientDetail = ({ params }: { params: { id: string } }) => {
  const patientId = Number(params.id);

  return <MainPage />;
};

export default PatientDetail;

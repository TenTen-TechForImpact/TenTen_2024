// app/patients/[id]/page.tsx

import React from "react";
import PatientDetailPage from "@/components/Patients/PatientDetailPage";

const PatientDetail = ({ params }: { params: { id: string } }) => {
  const patientId = Number(params.id);

  return <PatientDetailPage patientId={patientId} />;
};

export default PatientDetail;

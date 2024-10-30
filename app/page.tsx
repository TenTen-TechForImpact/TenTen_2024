// app/page.tsx

"use client";

import { Provider } from "react-redux";
import store from "../store/store";
import ConsultationRecordPage from "./ConsultationRecordPage";

export default function Page() {
  return (
    <Provider store={store}>
      <ConsultationRecordPage />
    </Provider>
  );
}

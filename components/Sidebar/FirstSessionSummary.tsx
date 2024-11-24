import React from "react";
import styles from "./FirstSessionSummary.module.css";

import { Tabs } from "flowbite-react";
import { Accordion, ListGroup } from "flowbite-react";
import { HiUserCircle, HiClipboardList, HiAdjustments } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";

interface PreQuestions {
  questions?: {
    list: string[];
  };
}

interface RecordingItem {
  id: string;
  s3_url: string;
  topic_status: string;
  stt_status: string;
  created_at: string;
}

interface FirstSessionSummaryProps {
  patientInfo: any;
  preQuestions: PreQuestions;
  sessionSummaryData: { topic_id: number; content: string }[];
  recentRecording: RecordingItem;
  topics: any[];
}

const FirstSessionSummary: React.FC<FirstSessionSummaryProps> = ({
  patientInfo,
  preQuestions,
  sessionSummaryData,
}) => {
  return (
    <div className={styles.summaryContainer}>
      <Tabs aria-label="Tabs with icons" variant="underline">
        <Tabs.Item active title="상담 요약" icon={HiUserCircle}>
          <div className="flex flex-col gap-4">
            {/* 환자 개인 정보 */}
            <Accordion alwaysOpen={true} className={styles.accordion}>
              <Accordion.Panel className={styles.accordionPanel}>
                <Accordion.Title className={styles.accordionTitle}>
                  환자 개인 정보
                </Accordion.Title>
                <Accordion.Content className={styles.accordionContent}>
                  <div className={styles.listItem}>
                    <span className={styles.boldTitle}>질병 종류:</span>
                    <span>없음</span>
                  </div>
                  <div className={styles.listItem}>
                    <span className={styles.boldTitle}>기타:</span>
                    <span>없음</span>
                  </div>
                  <div className={styles.listItem}>
                    <span className={styles.boldTitle}>
                      과거 질병 및 수술 이력:
                    </span>
                    <span>없음</span>
                  </div>
                  <div className={styles.listItem}>
                    <span className={styles.boldTitle}>주요 불편한 증상:</span>
                    <span>없음</span>
                  </div>
                </Accordion.Content>
              </Accordion.Panel>
            </Accordion>

            {/* 사전 상담 질문 */}
            <Accordion alwaysOpen={true} className={styles.accordion}>
              <Accordion.Panel>
                <Accordion.Title className={styles.accordionTitle}>
                  사전 상담 질문
                </Accordion.Title>
                <Accordion.Content className={styles.accordionContent}>
                  <div className={styles.listItem}>
                    <span className={styles.boldTitle}>질문:</span>
                    <span>질문 없음</span>
                  </div>
                </Accordion.Content>
              </Accordion.Panel>
            </Accordion>

            {/* 상담 녹음 요약 */}
            <Accordion alwaysOpen={true} className={styles.accordion}>
              <Accordion.Panel>
                <Accordion.Title className={styles.accordionTitle}>
                  상담 녹음 요약
                </Accordion.Title>
                <Accordion.Content className={styles.accordionContent}>
                  <div className={styles.listItem}>
                    <span className={styles.boldTitle}>질문:</span>
                    <span>질문 없음</span>
                  </div>
                </Accordion.Content>
              </Accordion.Panel>
            </Accordion>
          </div>
        </Tabs.Item>

        <Tabs.Item title="대화 내용" icon={MdDashboard}>
          <p>대화 내용 준비 중...</p>
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default FirstSessionSummary;

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

const question = {
  question_time: "51분 10초~51분 49초",
  question_no: 0,
  question: "간염 약의 부작용과 복용 시 주의사항은 무엇인가요?",
};

const session_summary = [
  {
    patient_statement:
      "환자는 간염 보유자로서 장기간 약을 복용 중이며, 약의 부작용과 복용 시 주의사항에 대해 궁금해함.",
    pharmacist_response: [
      {
        summary:
          "간염 약의 주요 부작용은 내성입니다. 약은 바이러스 증식을 억제하며, 내성이 생기면 다른 약으로 변경해야 할 수 있습니다.",
        quotes: [
          {
            time: "52분 3초",
            content:
              "이 약의 대표적인 부작용은 내성입니다. 바이러스를 억제하는 것이 치료의 핵심입니다.",
          },
          {
            time: "53분 28초",
            content:
              "지금은 억제가 잘 되고 있고, 한 가지 약으로 유지되고 있다는 것은 치료가 잘 되고 있다는 것입니다.",
          },
        ],
      },
    ],
  },
  {
    question_time: "53분 53초~54분 56초",
    question: "장기간 약 복용이 신체에 미치는 영향은 무엇인가요?",
    patient_statement:
      "환자는 장기간 동일한 약을 복용하는 것이 신체에 미치는 영향에 대해 궁금해함.",
    pharmacist_response: [
      {
        summary:
          "장기간 약 복용은 신체 대사에 부담을 주어 노화를 촉진할 수 있습니다. 그러나 약을 복용하지 않으면 간 손상이 더 심해질 수 있습니다.",
        quotes: [
          {
            time: "54분 8초",
            content:
              "약을 복용하면 대사 과정에 부담이 가해져 노화가 더 빨리 올 수 있습니다.",
          },
          {
            time: "55분 17초",
            content:
              "약을 안 먹었을 때는 더 급격히 안 좋아지기 때문에 복용하는 것이지만, 노화는 더 빨리 올 수 있습니다.",
          },
        ],
      },
    ],
  },
  {
    question_time: "59분 59초~60분 36초",
    question: "간염 보유자가 피해야 할 영양제는 무엇인가요?",
    patient_statement:
      "환자는 간염 보유자로서 피해야 할 영양제에 대해 궁금해함.",
    pharmacist_response: [
      {
        summary:
          "간염 보유자는 특별히 피해야 할 영양제는 없으며, 항산화 영양제를 꾸준히 섭취하는 것이 좋습니다.",
        quotes: [
          {
            time: "60분 36초",
            content:
              "간에 영향을 주는 영양제는 특별히 없으며, 항산화 영양제를 꾸준히 드시는 것이 좋습니다.",
          },
          {
            time: "61분 27초",
            content: "오메가-3와 같은 필수 영양소도 섭취하는 것이 좋습니다.",
          },
        ],
      },
    ],
  },
  {
    question_time: "62분 22초~63분 41초",
    question: "한약이 간에 미치는 영향은 무엇인가요?",
    patient_statement:
      "환자는 한약이 간에 미치는 부정적인 영향에 대해 궁금해함.",
    pharmacist_response: [
      {
        summary:
          "현대 한약은 성분이 명확하게 밝혀지고, 간 수치에 영향을 덜 미치는 방향으로 개선되었습니다.",
        quotes: [
          {
            time: "62분 41초",
            content:
              "예전에는 한약재의 성분이 명확하지 않아 간 수치가 올라갈 때 대처가 어려웠지만, 현재는 데이터가 축적되고 있어 더 안전한 처방이 이루어지고 있습니다.",
          },
          {
            time: "63분 41초",
            content:
              "한약의 추출물은 성분이 많아 간에 부담이 될 가능성이 큽니다.",
          },
        ],
      },
    ],
  },
];

const FirstSessionSummary: React.FC<FirstSessionSummaryProps> = ({
  patientInfo,
  preQuestions,
  sessionSummaryData,
}) => {
  return (
    <div className={styles.summaryContainer}>
      <Tabs aria-label="Tabs with icons" variant="underline">
        <Tabs.Item active title="상담 요약" icon={HiUserCircle}>
          <div className={styles.scrollableContent}>
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
                      <span className={styles.boldTitle}>
                        주요 불편한 증상:
                      </span>
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
              <Accordion alwaysOpen={true}>
                {session_summary.map((entry, idx) => (
                  <Accordion.Panel key={idx}>
                    <Accordion.Title>
                      <strong>{entry.question}</strong>
                    </Accordion.Title>
                    <Accordion.Content>
                      <div>
                        {/* 환자 발언 요약 */}
                        <div className={styles.questionSection}>
                          <p>{entry.patient_statement}</p>
                          {entry.pharmacist_response[0].quotes.map(
                            (quote, idx) => (
                              <div key={idx} className={styles.quoteBox}>
                                <blockquote className={styles.quoteText}>
                                  "{quote.content}"
                                </blockquote>
                                <span className={styles.timestamp}>
                                  {quote.time}
                                </span>
                              </div>
                            )
                          )}
                        </div>

                        {/* 약사 답변 요약 */}
                        <div className={styles.answerSummary}>
                          <p className={styles.boldLabel}>약사 답변 요약:</p>
                          <ol className={styles.orderedList}>
                            {entry.pharmacist_response.map((response, idx) => (
                              <li key={idx} className={styles.answerPoint}>
                                {response.summary}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </Accordion.Content>
                  </Accordion.Panel>
                ))}
              </Accordion>
            </div>
          </div>
        </Tabs.Item>

        <Tabs.Item title="대화 내용" icon={MdDashboard}>
          <div className={styles.scrollableContent}>
            <p>대화 내용 준비 중...</p>
          </div>
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default FirstSessionSummary;

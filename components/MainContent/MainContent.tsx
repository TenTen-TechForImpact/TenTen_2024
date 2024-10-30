// src/components/MainContent/MainContent.tsx
"use client";

import React from 'react';
import styles from './MainContent.module.css';

interface MainContentProps {
  isFollowUp: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ isFollowUp }) => {
  return (
    <div className={styles.mainContent}>
      {!isFollowUp && (
        <>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>환자 상세 정보</h3>
            <textarea placeholder="환자 상세 정보를 입력하세요" className={styles.textarea}></textarea>
          </div>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>상담 전 질문</h3>
            <textarea placeholder="상담 전 질문을 입력하세요" className={styles.textarea}></textarea>
          </div>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>처방 의약품</h3>
            <textarea placeholder="처방 의약품 정보를 입력하세요" className={styles.textarea}></textarea>
          </div>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>일반의약품+건강기능식품</h3>
            <textarea placeholder="일반의약품+건강기능식품 정보를 입력하세요" className={styles.textarea}></textarea>
          </div>
        </>
      )}

      {isFollowUp && (
        <>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>처방 의약품</h3>
            <textarea placeholder="처방 의약품 정보를 입력하세요" className={styles.textarea}></textarea>
          </div>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>일반의약품+건강기능식품</h3>
            <textarea placeholder="일반의약품+건강기능식품 정보를 입력하세요" className={styles.textarea}></textarea>
          </div>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>약사 중재 내용</h3>
            <textarea placeholder="약사 중재 내용을 입력하세요" className={styles.textarea}></textarea>
          </div>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>돌봄 노트</h3>
            <textarea placeholder="돌봄 노트를 입력하세요" className={styles.textarea}></textarea>
          </div>
        </>
      )}
    </div>
  );
};

export default MainContent;

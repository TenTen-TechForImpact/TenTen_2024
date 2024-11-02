// src/components/MainContent/RecordingSection.tsx
import React, { useState, useRef } from 'react';
import { FaMicrophone, FaStop, FaRedo, FaUpload } from 'react-icons/fa';
import AudioRecorder from '../../utils/Recording/audioRecorder';
import styles from './RecordingSection.module.css';

interface RecordingSectionProps {
  onRecordingStatusChange: (isRecording: boolean) => void;
  sessionId: string; // API 엔드포인트에 필요한 sessionId
}

const RecordingSection: React.FC<RecordingSectionProps> = ({ onRecordingStatusChange, sessionId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const recorderRef = useRef<AudioRecorder>(new AudioRecorder());

  const handleStartRecording = async () => {
    try {
      await recorderRef.current.startRecording();
      setIsRecording(true);
      onRecordingStatusChange(true);
    } catch (error) {
      console.error("녹음 시작 실패:", error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await recorderRef.current.stopRecording();
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      setIsRecording(false);
      onRecordingStatusChange(false);
    } catch (error) {
      console.error("녹음 중지 실패:", error);
    }
  };

  const handleResetRecording = () => {
    recorderRef.current.resetRecording();
    setAudioURL(null);
    setIsRecording(false);
    onRecordingStatusChange(false);
  };

  const handleUploadRecording = async () => {
    if (!audioURL) return;

    const response = await fetch(audioURL);
    const audioBlob = await response.blob();
    const formData = new FormData();
    formData.append('wavfile', new Blob([audioBlob], { type: 'audio/wav' }), 'recording.wav');

    try {
      const uploadResponse = await fetch(`/api/sessions/${sessionId}/upload-s3`, {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const data = await uploadResponse.json();
        alert(`File uploaded successfully. URL: ${data.fileUrl}`);
      } else {
        console.error("파일 업로드 실패:", uploadResponse.statusText);
      }
    } catch (error) {
      console.error("파일 업로드 오류:", error);
    }
  };

  return (
    <div className={styles.recordingSection}>
      <h3 className={styles.sectionTitle}>녹음하기</h3>
      <div className={styles.buttonContainer}>
        <button className={styles.startStopButton} onClick={isRecording ? handleStopRecording : handleStartRecording}>
          {isRecording ? <FaStop /> : <FaMicrophone />}
          <span className={styles.buttonLabel}>{isRecording ? '정지' : '녹음하기'}</span>
        </button>
        <button className={styles.resetButton} onClick={handleResetRecording} disabled={!audioURL}>
          <FaRedo />
          <span className={styles.buttonLabel}>초기화</span>
        </button>
        <button className={styles.uploadButton} onClick={handleUploadRecording} disabled={!audioURL}>
          <FaUpload />
          <span className={styles.buttonLabel}>업로드</span>
        </button>
      </div>
      {audioURL && (
        <div className={styles.audioContainer}>
          <audio src={audioURL} controls className={styles.audioPlayer} />
        </div>
      )}
    </div>
  );
};

export default RecordingSection;

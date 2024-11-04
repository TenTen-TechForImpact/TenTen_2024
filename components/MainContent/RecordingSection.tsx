import React, { useState, useRef } from "react";
import { FaMicrophone, FaPause, FaPlay, FaRedo, FaUpload, FaCheck } from "react-icons/fa";
import AudioRecorder from "../../utils/Recording/audioRecorder";
import styles from "./RecordingSection.module.css";

interface RecordingSectionProps {
  onRecordingStatusChange: (isRecording: boolean) => void;
  sessionId: string;
}

const RecordingSection: React.FC<RecordingSectionProps> = ({
  onRecordingStatusChange,
  sessionId,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const recorderRef = useRef<AudioRecorder>(new AudioRecorder());

  const handleStartOrPauseRecording = async () => {
    if (!isRecording) {
      try {
        await recorderRef.current.startRecording();
        setIsRecording(true);
        setIsPaused(false);
        onRecordingStatusChange(true);
      } catch (error) {
        console.error("녹음 시작 실패:", error);
      }
    } else if (isPaused) {
      recorderRef.current.resumeRecording();
      setIsPaused(false);
      onRecordingStatusChange(true);
    } else {
      recorderRef.current.pauseRecording();
      setIsPaused(true);
      onRecordingStatusChange(false);
    }
  };

  const handleCompleteRecording = async () => {
    try {
      const audioBlob = await recorderRef.current.stopRecording();
      const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });
      setAudioFile(audioFile);
      setIsRecording(false);
      setIsPaused(false);
      onRecordingStatusChange(false);
    } catch (error) {
      console.error("녹음 완료 실패:", error);
    }
  };

  const handleResetRecording = () => {
    recorderRef.current.resetRecording();
    setAudioFile(null);
    setIsRecording(false);
    setIsPaused(false);
    onRecordingStatusChange(false);
  };

  const handleUploadRecording = async () => {
    if (!audioFile) return;

    const formData = new FormData();
    formData.append("wavfile", audioFile);

    try {
      const uploadResponse = await fetch(`/api/sessions/${sessionId}/upload-s3`, {
        method: "POST",
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
        <button
          className={styles.startStopButton}
          onClick={handleStartOrPauseRecording}
        >
          {isRecording
            ? isPaused
              ? <FaPlay />
              : <FaPause />
            : <FaMicrophone />}
          <span className={styles.buttonLabel}>
            {isRecording
              ? isPaused
                ? "재개"
                : "일시정지"
              : "녹음하기"}
          </span>
        </button>
        {isRecording && (
          <button
            className={styles.completeButton}
            onClick={handleCompleteRecording}
          >
            <FaCheck />
            <span className={styles.buttonLabel}>녹음 완료</span>
          </button>
        )}
        <button
          className={styles.resetButton}
          onClick={handleResetRecording}
          disabled={!audioFile}
        >
          <FaRedo />
          <span className={styles.buttonLabel}>초기화</span>
        </button>
        <button
          className={styles.uploadButton}
          onClick={handleUploadRecording}
          disabled={!audioFile}
        >
          <FaUpload />
          <span className={styles.buttonLabel}>업로드</span>
        </button>
      </div>
      {audioFile && (
        <div className={styles.audioContainer}>
          <audio src={URL.createObjectURL(audioFile)} controls className={styles.audioPlayer} />
        </div>
      )}
    </div>
  );
};

export default RecordingSection;

import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import {
  FaMicrophone,
  FaPause,
  FaPlay,
  FaRedo,
  FaUpload,
  FaCheck,
} from "react-icons/fa";
import AudioRecorder from "../../utils/Recording/audioRecorder";
import styles from "./RecordingSection.module.css";

interface RecordingSectionProps {
  onRecordingStatusChange: (isRecording: boolean) => void;
  sessionId: string;
}

// Type for handling file input
interface FileInput {
  file: File | null;
}

interface Props {
  params: { sessionId: string };
}

interface RecordingItem {
  id: string;
  s3_url: string;
  topic_status: string;
  stt_status: string;
  created_at: string;
}

const RecordingSection: React.FC<RecordingSectionProps> = ({
  onRecordingStatusChange,
  sessionId,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const recorderRef = useRef<AudioRecorder>(new AudioRecorder());

  /*const [recentRecording, setRecentRecording] = useState<RecordingItem | null>(
    null
  );
  const [topics, setTopics] = useState<any[]>([]); // Topic 데이터를 저장할 상태

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await fetch(
          `/api/sessions/${sessionId}/get_recording`
        );
        if (response.ok) {
          const data: RecordingItem[] = await response.json();
          console.log("Fetched Recordings:", data);
          // 가장 최근 녹음 파일 선택
          if (data.length > 0) {
            const latestRecording = data.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )[0];

            setRecentRecording(latestRecording); // 최근 녹음 ID 저장
          }
        } else {
          console.error("Failed to fetch recordings:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching recordings:", error);
      }
    };

    fetchRecordings();
  }, [sessionId]);

  // Fetch topics using the recent recordingId
  useEffect(() => {
    const fetchTopics = async () => {
      if (!recentRecording) return;
      if (recentRecording.topic_status != "completed") {
        console.log("stt", recentRecording.stt_status, "topic", recentRecording.topic_status,);
        return;
      }
      try {
        const response = await fetch(
          `/api/recordings/${recentRecording.id}/topic`,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Topics:", data);
          setTopics(data.topicSummaries || []); // Topic 데이터 저장
        } else {
          console.error("Failed to fetch topics:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, [recentRecording]);*/

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
      const audioFile = new File([audioBlob], "recording.wav", {
        type: "audio/wav",
      });
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
      const uploadResponse = await fetch(
        `/api/sessions/${sessionId}/upload-s3`,
        {
          method: "POST",
          body: formData,
        }
      );

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

  // Upload local file (should be .wav file)
  const [fileInput, setFileInput] = useState<FileInput>({ file: null });
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileInput({ file: files[0] });
    }
  };

  // Handle form submit to upload the file
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { file } = fileInput;
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    if (file.type !== "audio/wav") {
      setUploadStatus("Please select a .wav file.");
      return;
    }

    try {
      // Step 1: Request Presigned URL
      setUploadStatus("Requesting upload URL...");
      const presignedUrlResponse = await fetch(
        `/api/sessions/${sessionId}/presigned-url`,
        {
          method: "POST",
          body: JSON.stringify({ filename: file.name }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!presignedUrlResponse.ok) {
        setUploadStatus("Failed to get upload URL.");
        return;
      }

      const { url } = await presignedUrlResponse.json();

      // Step 2: Upload file to S3
      setUploadStatus("Uploading file to S3...");
      const s3UploadResponse = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!s3UploadResponse.ok) {
        setUploadStatus("File upload to S3 failed.");
        return;
      }

      // Step 3: Notify backend to update the database
      setUploadStatus("Updating database...");
      const dbUpdateResponse = await fetch(
        `/api/sessions/${sessionId}/update-recording`,
        {
          method: "POST",
          body: JSON.stringify({ fileUrl: url.split("?")[0] }), // S3 파일 URL에서 query string 제거
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!dbUpdateResponse.ok) {
        setUploadStatus("Failed to update the database.");
        return;
      }

      setUploadStatus("File uploaded successfully and saved to DB");
      console.log("Upload and DB update successful");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("An error occurred during upload.");
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
          {isRecording ? isPaused ? <FaPlay /> : <FaPause /> : <FaMicrophone />}
          <span className={styles.buttonLabel}>
            {isRecording ? (isPaused ? "재개" : "일시정지") : "녹음하기"}
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

      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit">음성파일 업로드하기 (wav파일)</button>
      </form>

      {audioFile && (
        <div className={styles.audioContainer}>
          <audio
            src={URL.createObjectURL(audioFile)}
            controls
            className={styles.audioPlayer}
          />
        </div>
      )}
    </div>
  );
};

export default RecordingSection;

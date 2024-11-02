// src/utils/Recording/audioRecorder.ts

class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;

  // 녹음 시작 메서드
  async startRecording(): Promise<void> {
    if (this.isRecording) return; // 이미 녹음 중일 경우 중복 시작 방지
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      this.audioChunks.push(event.data);
    };

    this.mediaRecorder.start();
    this.isRecording = true; // 녹음 중 상태로 설정
  }

  // 녹음 종료 메서드
  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        return reject("녹음이 진행 중이지 않습니다.");
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.isRecording = false; // 녹음 상태 초기화
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  // 녹음 상태 반환
  getRecordingStatus(): boolean {
    return this.isRecording;
  }

  // 녹음 상태 초기화
  resetRecording() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
  }
}

export default AudioRecorder;

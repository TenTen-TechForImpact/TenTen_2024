"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

// Type for handling file input
interface FileInput {
  file: File | null;
}

export default function UploadRecording() {
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

    if (!fileInput.file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.file);

    try {
      const response = await fetch("/api/upload-s3", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus(`File uploaded successfully: ${data.fileUrl}`);
      } else {
        setUploadStatus("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("An error occurred while uploading the file.");
    }
  };

  return (
    <div className="container">
      <h1>Upload Your Audio Recording</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}

"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { createClient } from "@/utils/supabase/component";

// Type for handling file input
interface FileInput {
  file: File | null;
}

export default function UploadRecording() {
  const supabase = createClient();

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
      setUploadStatus("Uploading file...");
      const response = await fetch("/api/upload-s3", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("Inserting data into Supabase...");
        const data = await response.json();
        const fileUrl = data.fileUrl;
        // Insert into supabase
        const { error } = await supabase
          .from("Recording")
          .insert({ file_url: fileUrl });
        if (error) {
          throw new Error(
            `Error inserting data into Supabase: ${error.message}`
          );
        }

        setUploadStatus(
          `File uploaded successfully and saved to DB: ${data.fileUrl}`
        );
        // TODO: request to ai server to get summary
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

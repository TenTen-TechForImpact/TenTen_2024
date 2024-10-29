"use client";

import { createClient } from "@/utils/supabase/component";

export default async function Recordings() {
  // const supabase = createClient();
  // const { data: recordings } = await supabase.from("Recording").select();

  const handleClick = async () => {
    console.log("clicked");
    try {
      console.log("Requesting transcription...");
      const response = await fetch("/api/transcription", {
        method: "POST",
        body: "",
      });

      if (response.ok) {
        // TODO: request to ai server to get summary
        console.log("Transcription requested successfully");
      } else {
        console.error("Error getting transcription:", response.statusText);
      }
    } catch (error) {
      console.error("Error getting transcription:", error);
    }
  };

  return (
    <div>
      {/* <pre>{JSON.stringify(recordings, null, 2)}</pre> */}
      <button onClick={handleClick}>click</button>
    </div>
  );
  // TODO: Render the list of recordings as buttons
}

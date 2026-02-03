"use server";

import { SpeechClient } from "@google-cloud/speech";

// Initialize the client
// Trying to use the API Key if possible, otherwise might need Service Account (Firebase)
// Note: Google Cloud Node.js client usually prefers Service Account.
// However, we can try passing apiKey.
const client = new SpeechClient({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  // If the above doesn't work, we might fall back to:
  // credentials: {
  //   client_email: process.env.FIREBASE_CLIENT_EMAIL,
  //   private_key: process.env.FIREBASE_PRIVATE_KEY,
  // }
});

export async function transcribeAudio(formData: FormData): Promise<string> {
  try {
    const audioEntry = formData.get("audio");
    if (!audioEntry || !(audioEntry instanceof Blob)) {
      throw new Error("No audio file provided");
    }

    const audioBlob = audioEntry;
    const arrayBuffer = await audioBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Detect format or assume WebM (from standard MediaRecorder)
    // The sample uses LINEAR16, but web browsers usually send WEBM/OPUS
    const audioBytes = buffer.toString("base64");

    const request = {
      audio: {
        content: audioBytes,
      },
      config: {
        enableAutomaticPunctuation: true,
        encoding: "WEBM_OPUS" as const, // Standard for MediaRecorder
        sampleRateHertz: 48000, // Typical for WebM
        languageCode: "en-US",
        useEnhanced: true,
        model: "video", // Enhanced model suitable for video/multimedia
      },
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    
    const transcription = response.results
      ?.map((result) => result.alternatives?.[0].transcript)
      .join("\n");

    return transcription || "";
  } catch (error) {
    console.error("Cloud Speech API error:", error);
    throw new Error("Failed to transcribe audio using Cloud Speech API");
  }
}

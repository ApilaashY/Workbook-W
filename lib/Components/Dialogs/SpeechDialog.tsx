import { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./Dialogs.css";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { transcribeAudio } from "@/app/actions/transcribe";

interface SpeechDialogProps {
  onResolve: (value: string | null) => void;
}

function SpeechDialog({ onResolve }: SpeechDialogProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Click to start recording...");
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceStartRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const SILENCE_THRESHOLD = 20; // Amplitude threshold (0-255)
  const SILENCE_DURATION = 2000; // Time in ms to wait before stopping

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Setup VAD
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        cleanupAudioContext(); // cleanup context
        
        setStatus("Transcribing...");
        await handleTranscribe(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus("Listening...");
      setError(null);
      
      // Start detection loop
      detectSilence();

    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please allow permissions.");
    }
  };

  const detectSilence = () => {
    const analyser = analyserRef.current;
    if (!analyser || !mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    // Calculate average volume
    const sum = dataArray.reduce((a, b) => a + b, 0);
    const average = sum / dataArray.length;

    if (average > SILENCE_THRESHOLD) {
      // User is speaking
      silenceStartRef.current = null;
      setStatus("Listening...");
    } else {
      // Silence detected
      if (silenceStartRef.current === null) {
        silenceStartRef.current = Date.now();
      } else {
        const silenceDuration = Date.now() - silenceStartRef.current;
        if (silenceDuration > SILENCE_DURATION) {
          setStatus("Silence detected. Processing...");
          stopRecording();
          return; // Stop loop
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(detectSilence);
  };

  const cleanupAudioContext = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      cleanupAudioContext();
    }
  };

  const handleTranscribe = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const text = await transcribeAudio(formData);
      onResolve(text);
    } catch (err) {
      console.error("Transcription error:", err);
      setError("Failed to transcribe audio. Check API key or network.");
      setStatus("Error. Try again.");
    }
  };

  const handleCancel = () => {
    if (isRecording) {
      stopRecording();
    }
    onResolve(null);
  };

  return (
    <div className="prompt-overlay" onClick={handleCancel}>
      <div className="prompt-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="prompt-header">
          <h3>Speech Input</h3>
        </div>

        <div className="prompt-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px' }}>
            <div 
                onClick={isRecording ? stopRecording : startRecording}
                style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: isRecording ? '#ff4444' : '#4444ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '32px',
                    transition: 'all 0.2s',
                    position: 'relative'
                }}
            >
                {/* Visual ripple effect could go here */}
                {isRecording ? <FaStop /> : <FaMicrophone />}
            </div>
            <p className="prompt-message" style={{ textAlign: 'center' }}>{status}</p>
            {error && <p className="prompt-error">{error}</p>}
        </div>

        <div className="prompt-footer">
          <button
            onClick={handleCancel}
            className="prompt-btn prompt-btn-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function speechDialog(): Promise<string | null> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const cleanup = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    const handleResolve = (value: string | null) => {
      cleanup();
      resolve(value);
    };

    root.render(<SpeechDialog onResolve={handleResolve} />);
  });
}

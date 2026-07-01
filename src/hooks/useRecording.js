import { useState, useRef, useCallback, useEffect } from "react";
import {
  requestMicrophoneStream,
  createAudioContext,
  getSupportedMimeType,
  resolveBlobMimeType,
  isRecordingSupported,
  getMicrophoneErrorMessage,
} from "../utils/media";
import {
  createLiveRecognizer,
  isSpeechRecognitionSupported,
} from "../utils/speechRecognition";

export function useRecording(notify) {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [micSupported, setMicSupported] = useState(true);
  const [freshRecording, setFreshRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);

  const mediaRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioCtxRef = useRef(null);
  const mimeTypeRef = useRef("");
  const speechRef = useRef(null);
  const liveTextRef = useRef("");

  useEffect(() => {
    setMicSupported(isRecordingSupported());
    setSpeechSupported(isSpeechRecognitionSupported());
  }, []);

  useEffect(() => {
    return () => {
      speechRef.current?.abort?.();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close();
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    setAnalyser(null);
  }, []);

  const stopSpeechRecognition = useCallback(() => {
    speechRef.current?.stop?.();
    speechRef.current = null;
  }, []);

  const startSpeechRecognition = useCallback(() => {
    if (!isSpeechRecognitionSupported()) return;

    liveTextRef.current = "";
    setLiveTranscript("");

    const rec = createLiveRecognizer({
      lang: "es-ES",
      onFinalText: (text) => {
        liveTextRef.current = `${liveTextRef.current} ${text}`.trim();
        setLiveTranscript(liveTextRef.current);
      },
      onError: (code) => {
        if (code === "not-allowed") {
          notify("Permiso de reconocimiento de voz denegado.", "error");
        }
      },
    });

    if (!rec) return;

    speechRef.current = rec;
    try {
      rec.start();
    } catch {
      speechRef.current = null;
    }
  }, [notify]);

  const startRecording = useCallback(async () => {
    if (!isRecordingSupported()) {
      notify(
        "Tu navegador no soporta grabación. Usa Chrome, Firefox, Safari o Edge en HTTPS.",
        "error"
      );
      return;
    }

    try {
      setFreshRecording(false);
      setAudioBlob(null);
      setLiveTranscript("");
      liveTextRef.current = "";
      setAudioURL((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });

      const stream = await requestMicrophoneStream();
      streamRef.current = stream;

      const actx = await createAudioContext();
      const src = actx.createMediaStreamSource(stream);
      const anl = actx.createAnalyser();
      anl.fftSize = 256;
      src.connect(anl);
      audioCtxRef.current = actx;
      setAnalyser(anl);

      startSpeechRecognition();

      const mimeType = getSupportedMimeType();
      mimeTypeRef.current = mimeType;

      const options = mimeType ? { mimeType } : undefined;
      const mr = new MediaRecorder(stream, options);
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        setTimeout(() => stopSpeechRecognition(), 400);

        const blobType = resolveBlobMimeType(mr.mimeType, mimeTypeRef.current);
        const blob = new Blob(chunksRef.current, { type: blobType });
        setAudioBlob(blob);
        setAudioURL((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        cleanupStream();
        setFreshRecording(true);
        notify("Grabación guardada ✓", "success");
      };

      mr.onerror = () => {
        stopSpeechRecognition();
        notify("Error durante la grabación", "error");
        cleanupStream();
        setRecording(false);
      };

      mr.start(250);
      mediaRef.current = mr;
      setRecording(true);
    } catch (err) {
      stopSpeechRecognition();
      console.error("Microphone error:", err);
      notify(getMicrophoneErrorMessage(err), "error");
      cleanupStream();
    }
  }, [notify, cleanupStream, startSpeechRecognition, stopSpeechRecognition]);

  const stopRecording = useCallback(() => {
    const mr = mediaRef.current;
    if (mr && mr.state !== "inactive") {
      try {
        mr.requestData();
      } catch {
        /* algunos navegadores no implementan requestData */
      }
      mr.stop();
    }
    setRecording(false);
  }, []);

  const clearFreshRecording = useCallback(() => setFreshRecording(false), []);

  return {
    recording,
    audioBlob,
    audioURL,
    analyser,
    micSupported,
    speechSupported,
    liveTranscript,
    freshRecording,
    clearFreshRecording,
    startRecording,
    stopRecording,
  };
}

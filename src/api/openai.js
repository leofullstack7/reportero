import { formatOpenAIError } from "../utils/openaiErrors";

const OPENAI_BASE = import.meta.env.DEV ? "/api/openai" : "https://api.openai.com";

const CHAT_URL =
  import.meta.env.VITE_OPENAI_API_URL || `${OPENAI_BASE}/v1/chat/completions`;

const TRANSCRIPTION_URL =
  import.meta.env.VITE_OPENAI_TRANSCRIPTION_URL ||
  `${OPENAI_BASE}/v1/audio/transcriptions`;

function getAuthHeaders(contentTypeJson = true) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const headers = {};

  if (contentTypeJson) {
    headers["Content-Type"] = "application/json";
  }

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
}

function extensionFromMime(mime = "") {
  if (mime.includes("webm")) return "webm";
  if (mime.includes("mp4") || mime.includes("aac") || mime.includes("m4a")) return "mp4";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("wav")) return "wav";
  return "webm";
}

export function hasOpenAIKey() {
  return Boolean(import.meta.env.VITE_OPENAI_API_KEY);
}

export async function transcribeAudio(blob, language = "es", signal = null) {
  if (!hasOpenAIKey()) {
    throw new Error(
      "Falta VITE_OPENAI_API_KEY en .env. Crea el archivo y reinicia npm run dev."
    );
  }

  if (!blob || blob.size === 0) {
    throw new Error("La grabación está vacía. Graba al menos unos segundos de audio.");
  }

  const mime = blob.type || "audio/webm";
  const ext = extensionFromMime(mime);
  const file = new File([blob], `recording.${ext}`, { type: mime });

  const form = new FormData();
  form.append("file", file);
  form.append("model", "whisper-1");
  form.append("language", language);
  form.append("response_format", "text");

  const res = await fetch(TRANSCRIPTION_URL, {
    method: "POST",
    headers: getAuthHeaders(false),
    body: form,
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const formatted = formatOpenAIError(err.error || err);
    const error = new Error(formatted.message);
    error.code = formatted.code;
    throw error;
  }

  const text = await res.text();
  return text.trim();
}

export async function callGPT(messages, system = "", signal = null) {
  if (!hasOpenAIKey()) {
    throw new Error(
      "Falta VITE_OPENAI_API_KEY en .env. Crea el archivo y reinicia npm run dev."
    );
  }

  const apiMessages = [];
  if (system) {
    apiMessages.push({ role: "system", content: system });
  }
  apiMessages.push(...messages);

  const res = await fetch(CHAT_URL, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({
      model: "gpt-4o",
      messages: apiMessages,
      max_tokens: 1000,
    }),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const formatted = formatOpenAIError(err.error || err);
    const error = new Error(formatted.message);
    error.code = formatted.code;
    throw error;
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

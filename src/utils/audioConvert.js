import { createAudioContext } from "./media";

function writeString(view, offset, str) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function encodeWav(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = length * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
}

function normalizeMime(mime = "") {
  const base = mime.split(";")[0].trim().toLowerCase();
  if (!base || base === "application/octet-stream") return "";
  return base;
}

function extensionForMime(mime) {
  if (mime.includes("wav")) return "wav";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3";
  if (mime.includes("m4a") || mime.includes("mp4") || mime.includes("aac")) return "m4a";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("webm")) return "webm";
  return "webm";
}

/** Convierte cualquier grabación del navegador a WAV (aceptado por Whisper en todos los dispositivos). */
export async function convertBlobToWav(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const ctx = await createAudioContext();

  try {
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
    return encodeWav(audioBuffer);
  } finally {
    await ctx.close().catch(() => {});
  }
}

/**
 * Prepara un File listo para la API de Whisper.
 * En móvil (iOS/Android) convierte a WAV para evitar "Invalid file format".
 */
export async function prepareAudioForWhisper(blob) {
  if (!blob || blob.size === 0) {
    throw new Error("La grabación está vacía. Graba al menos unos segundos de audio.");
  }

  try {
    const wavBlob = await convertBlobToWav(blob);
    return new File([wavBlob], "recording.wav", { type: "audio/wav" });
  } catch (err) {
    console.warn("WAV conversion failed, using original blob:", err);

    const mime = normalizeMime(blob.type) || "audio/webm";
    const ext = extensionForMime(mime);
    return new File([blob], `recording.${ext}`, { type: mime });
  }
}

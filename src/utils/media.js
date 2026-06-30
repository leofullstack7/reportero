/** Compatibilidad de micrófono y grabación entre navegadores (desktop y móvil). */

export function isSecureContext() {
  return (
    window.isSecureContext ||
    location.protocol === "https:" ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1"
  );
}

export function getMediaDevices() {
  if (navigator.mediaDevices?.getUserMedia) {
    return navigator.mediaDevices;
  }

  const legacy =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  if (legacy) {
    return {
      getUserMedia: (constraints) =>
        new Promise((resolve, reject) =>
          legacy.call(navigator, constraints, resolve, reject)
        ),
    };
  }

  return null;
}

export function isRecordingSupported() {
  return (
    typeof MediaRecorder !== "undefined" &&
    getMediaDevices() !== null &&
    isSecureContext()
  );
}

export function getSupportedMimeType() {
  if (typeof MediaRecorder === "undefined") return "";

  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/aac",
    "audio/ogg;codecs=opus",
    "audio/ogg",
    "",
  ];

  for (const type of types) {
    if (!type || MediaRecorder.isTypeSupported(type)) return type;
  }

  return "";
}

export async function requestMicrophoneStream() {
  if (!isSecureContext()) {
    const err = new Error("SECURE_CONTEXT_REQUIRED");
    err.name = "SecurityError";
    throw err;
  }

  const devices = getMediaDevices();
  if (!devices) {
    const err = new Error("NOT_SUPPORTED");
    err.name = "NotSupportedError";
    throw err;
  }

  const constraints = {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  };

  try {
    return await devices.getUserMedia(constraints);
  } catch (err) {
    if (
      err.name === "OverconstrainedError" ||
      err.name === "ConstraintNotSatisfiedError"
    ) {
      return devices.getUserMedia({ audio: true });
    }
    throw err;
  }
}

export async function createAudioContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    throw new Error("AudioContext no disponible en este navegador");
  }

  const ctx = new AudioCtx();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  return ctx;
}

export function getMicrophoneErrorMessage(err) {
  if (err?.message === "SECURE_CONTEXT_REQUIRED") {
    return "El micrófono requiere HTTPS o localhost. Abre la app en una conexión segura.";
  }

  switch (err?.name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
      return "Permiso de micrófono denegado. Actívalo en la configuración del navegador o del sistema.";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "No se encontró ningún micrófono conectado.";
    case "NotReadableError":
    case "TrackStartError":
      return "El micrófono está en uso por otra aplicación.";
    case "NotSupportedError":
      return "Tu navegador no soporta grabación de audio.";
    case "SecurityError":
      return "El micrófono requiere HTTPS o localhost.";
    case "AbortError":
      return "Acceso al micrófono cancelado.";
    default:
      return err?.message || "No se pudo acceder al micrófono.";
  }
}

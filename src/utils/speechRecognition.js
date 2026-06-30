export function isSpeechRecognitionSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createLiveRecognizer({ lang = "es-ES", onFinalText, onError }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;

  const rec = new SR();
  rec.lang = lang;
  rec.continuous = true;
  rec.interimResults = false;

  rec.onresult = (event) => {
    let chunk = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        chunk += event.results[i][0].transcript;
      }
    }
    if (chunk.trim()) onFinalText?.(chunk.trim());
  };

  rec.onerror = (event) => {
    if (event.error !== "aborted" && event.error !== "no-speech") {
      onError?.(event.error);
    }
  };

  return rec;
}

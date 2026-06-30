import { useState } from "react";
import { callGPT, transcribeAudio as transcribeWithWhisper } from "./api/openai";
import { useNotification } from "./hooks/useNotification";
import { useAuth } from "./hooks/useAuth";
import { useRecording } from "./hooks/useRecording";
import { useTimer } from "./hooks/useTimer";
import { useTranscriptionHistory } from "./hooks/useTranscriptionHistory";
import { AuthPanel } from "./components/AuthPanel";
import { Header } from "./components/Header";
import { TabBar } from "./components/TabBar";
import { Notification } from "./components/Notification";
import { RecordTab } from "./components/tabs/RecordTab";
import { TranscriptTab } from "./components/tabs/TranscriptTab";
import { HistoryTab } from "./components/tabs/HistoryTab";
import { SummaryTab } from "./components/tabs/SummaryTab";
import { ChatTab } from "./components/tabs/ChatTab";
import { TranslateTab } from "./components/tabs/TranslateTab";
import { styles as s } from "./styles/styles";
import "./index.css";

export default function App() {
  const { user, authLoading, signIn, signUp, signOut, supabaseConfigured } = useAuth();

  if (authLoading) {
    return (
      <div style={{ ...s.app, justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>Cargando sesión…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthPanel
        signIn={signIn}
        signUp={signUp}
        supabaseConfigured={supabaseConfigured}
      />
    );
  }

  return <MainApp user={user} onSignOut={signOut} />;
}

function MainApp({ user, onSignOut }) {
  const [tab, setTab] = useState("record");
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [activeTranscriptionId, setActiveTranscriptionId] = useState(null);
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [transInput, setTransInput] = useState("");
  const [transOutput, setTransOutput] = useState("");
  const [transLangFrom, setTransLangFrom] = useState("Español");
  const [transLangTo, setTransLangTo] = useState("English");
  const [loading, setLoading] = useState({});
  const [copied, setCopied] = useState(false);

  const { notification, notify } = useNotification();
  const {
    history,
    historyLoading,
    supabaseConfigured,
    loadHistory,
    saveToHistory,
    saveSummaryToHistory,
    removeFromHistory,
  } = useTranscriptionHistory(notify, user);
  const {
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
  } = useRecording(notify);

  const timer = useTimer(recording);
  const setLoad = (key, val) => setLoading((p) => ({ ...p, [key]: val }));

  const handleSignOut = async () => {
    try {
      await onSignOut();
    } catch (err) {
      notify(err.message || "No se pudo cerrar sesión", "error");
    }
  };

  const persistTranscript = async (text, source = "whisper") => {
    setTranscript(text);
    setSummary("");
    setActiveTranscriptionId(null);

    const label =
      source === "browser"
        ? "Transcripción del navegador completada ✓"
        : "Transcripción completada ✓";

    const row = await saveToHistory(text, source);
    if (row) {
      setActiveTranscriptionId(row.id);
      notify(`${label} Guardada en tu historial.`, "success");
    } else {
      notify(label, "success");
    }
  };

  const transcribeWithBrowser = async () => {
    if (!liveTranscript?.trim()) {
      notify(
        "No hay texto capturado. Graba de nuevo en Chrome/Edge y habla claramente cerca del micrófono.",
        "error"
      );
      return false;
    }
    await persistTranscript(liveTranscript.trim(), "browser");
    return true;
  };

  const transcribeAudio = async (preferBrowser = false) => {
    if (!audioBlob && !liveTranscript?.trim()) {
      notify("Primero graba audio", "error");
      return;
    }

    setLoad("transcript", true);
    setTab("transcript");
    clearFreshRecording();

    if (preferBrowser) {
      if (await transcribeWithBrowser()) {
        setLoad("transcript", false);
      } else {
        setTab("record");
        setLoad("transcript", false);
      }
      return;
    }

    try {
      const result = await transcribeWithWhisper(audioBlob, "es");
      if (!result) {
        throw new Error("No se detectó voz en el audio. Intenta grabar más cerca del micrófono.");
      }
      await persistTranscript(result, "whisper");
    } catch (err) {
      console.error("Transcription error:", err);

      if (err.code === "QUOTA_EXCEEDED" && liveTranscript?.trim()) {
        await persistTranscript(liveTranscript.trim(), "browser");
        notify(
          "OpenAI sin créditos — usamos la transcripción capturada por el navegador.",
          "info"
        );
      } else if (err.code === "QUOTA_EXCEEDED") {
        notify(err.message, "error");
        setTab("record");
      } else if (liveTranscript?.trim()) {
        await persistTranscript(liveTranscript.trim(), "browser");
        notify("Whisper falló — usamos la transcripción del navegador.", "info");
      } else {
        notify(err.message || "Error en transcripción", "error");
        setTab("record");
      }
    }
    setLoad("transcript", false);
  };

  const generateSummary = async () => {
    const text = transcript || "No hay transcripción disponible.";
    setLoad("summary", true);
    setTab("summary");
    try {
      const result = await callGPT(
        [
          {
            role: "user",
            content: `Genera un resumen ejecutivo profesional de esta reunión:\n\n${text}`,
          },
        ],
        `Eres un asistente ejecutivo experto. Genera resúmenes estructurados con:
1. 📋 RESUMEN GENERAL (2-3 oraciones)
2. ✅ DECISIONES TOMADAS (lista)
3. 🎯 PUNTOS DE ACCIÓN (con responsables y fechas si se mencionan)
4. 📊 TEMAS TRATADOS (lista)
5. ⚠️ PENDIENTES / SEGUIMIENTO
Usa formato Markdown. Sé conciso y ejecutivo.`
      );
      setSummary(result);
      if (activeTranscriptionId) {
        await saveSummaryToHistory(activeTranscriptionId, result);
      }
      notify("Resumen generado ✓", "success");
    } catch (err) {
      notify(err.message || "Error al generar resumen", "error");
    }
    setLoad("summary", false);
  };

  const sendChat = async () => {
    const q = chatInput.trim();
    if (!q) return;
    const userMsg = { role: "user", content: q };
    setChatMsgs((p) => [...p, userMsg]);
    setChatInput("");
    setLoad("chat", true);
    try {
      const historyMsgs = [...chatMsgs, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const result = await callGPT(
        historyMsgs,
        `Eres un asistente inteligente de reuniones. Tienes acceso a esta transcripción:
---
${transcript || "(Sin transcripción aún)"}
---
Y este resumen:
---
${summary || "(Sin resumen aún)"}
---
Responde preguntas sobre la reunión, extrae información específica, o ayuda con cualquier análisis. Sé preciso y útil.`
      );
      setChatMsgs((p) => [...p, { role: "assistant", content: result }]);
    } catch {
      setChatMsgs((p) => [
        ...p,
        { role: "assistant", content: "Error al procesar tu pregunta." },
      ]);
    }
    setLoad("chat", false);
  };

  const translate = async () => {
    const text = transInput.trim();
    if (!text) return;
    setLoad("translate", true);
    try {
      const result = await callGPT(
        [
          {
            role: "user",
            content: `Traduce el siguiente texto de ${transLangFrom} a ${transLangTo}. Responde SOLO con la traducción, sin explicaciones ni texto adicional:\n\n${text}`,
          },
        ],
        "Eres un traductor experto. Traduce con precisión, naturalidad y respetando el tono del texto original."
      );
      setTransOutput(result);
    } catch (err) {
      notify(err.message || "Error en la traducción", "error");
    }
    setLoad("translate", false);
  };

  const translateTranscript = () => {
    if (!transcript) {
      notify("No hay transcripción para traducir", "error");
      return;
    }
    setTransInput(transcript);
    setTab("translate");
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openHistoryItem = (item) => {
    setTranscript(item.content);
    setSummary(item.summary || "");
    setActiveTranscriptionId(item.id);
    setChatMsgs([]);
    setTab("transcript");
    notify("Transcripción cargada del historial", "success");
  };

  const handleDeleteHistory = async (id) => {
    await removeFromHistory(id);
    if (activeTranscriptionId === id) {
      setActiveTranscriptionId(null);
    }
  };

  return (
    <div style={s.app}>
      <Notification notification={notification} />

      <Header audioBlob={audioBlob} user={user} onSignOut={handleSignOut} />

      <div style={s.card}>
        <TabBar tab={tab} setTab={setTab} />

        <div style={s.body}>
          {tab === "record" && (
            <RecordTab
              recording={recording}
              timer={timer}
              analyser={analyser}
              audioBlob={audioBlob}
              audioURL={audioURL}
              micSupported={micSupported}
              speechSupported={speechSupported}
              liveTranscript={liveTranscript}
              freshRecording={freshRecording}
              loading={loading}
              startRecording={startRecording}
              stopRecording={stopRecording}
              transcribeAudio={transcribeAudio}
              transcribeWithBrowser={() => transcribeAudio(true)}
              generateSummary={generateSummary}
            />
          )}

          {tab === "transcript" && (
            <TranscriptTab
              transcript={transcript}
              setTranscript={setTranscript}
              loading={loading}
              copied={copied}
              copyText={copyText}
              translateTranscript={translateTranscript}
              generateSummary={generateSummary}
              setChatMsgs={setChatMsgs}
              setTab={setTab}
              savedInHistory={!!activeTranscriptionId}
            />
          )}

          {tab === "history" && (
            <HistoryTab
              history={history}
              historyLoading={historyLoading}
              supabaseConfigured={supabaseConfigured}
              activeId={activeTranscriptionId}
              onOpen={openHistoryItem}
              onDelete={handleDeleteHistory}
              onRefresh={loadHistory}
              setTab={setTab}
            />
          )}

          {tab === "summary" && (
            <SummaryTab
              summary={summary}
              transcript={transcript}
              loading={loading}
              copied={copied}
              copyText={copyText}
              generateSummary={generateSummary}
              setTab={setTab}
            />
          )}

          {tab === "chat" && (
            <ChatTab
              chatMsgs={chatMsgs}
              chatInput={chatInput}
              setChatInput={setChatInput}
              loading={loading}
              sendChat={sendChat}
              setChatMsgs={setChatMsgs}
            />
          )}

          {tab === "translate" && (
            <TranslateTab
              transInput={transInput}
              setTransInput={setTransInput}
              transOutput={transOutput}
              setTransOutput={setTransOutput}
              transLangFrom={transLangFrom}
              setTransLangFrom={setTransLangFrom}
              transLangTo={transLangTo}
              setTransLangTo={setTransLangTo}
              transcript={transcript}
              loading={loading}
              copied={copied}
              copyText={copyText}
              translate={translate}
            />
          )}
        </div>
      </div>

      <div
        style={{
          color: "rgba(255,255,255,0.2)",
          fontSize: 12,
          paddingBottom: 24,
          textAlign: "center",
        }}
      >
        El Reportero · Cuenta privada · Historial seguro en Supabase
      </div>
    </div>
  );
}

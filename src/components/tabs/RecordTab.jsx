import { icons } from "../../constants/icons";
import { Icon } from "../Icon";
import { WaveformVisualizer } from "../WaveformVisualizer";
import { styles as s } from "../../styles/styles";

export function RecordTab({
  recording,
  timer,
  analyser,
  audioBlob,
  audioURL,
  micSupported,
  speechSupported,
  liveTranscript,
  freshRecording,
  loading,
  startRecording,
  stopRecording,
  transcribeAudio,
  transcribeWithBrowser,
  generateSummary,
}) {
  const showTranscribeCta = audioBlob && !recording;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
            Grabación de Reunión
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
            Graba audio en tiempo real desde tu micrófono
          </div>
        </div>
        {recording && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, ...s.badge("") }}>
            <span style={{ animation: "pulse 1s infinite", color: "#ef4444" }}>●</span>
            <span style={{ color: "#fca5a5", fontWeight: 700, fontSize: 16 }}>{timer}</span>
          </div>
        )}
      </div>

      {!micSupported && (
        <div
          style={{
            ...s.resultBox,
            marginBottom: 20,
            borderColor: "rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.08)",
          }}
        >
          ⚠️ Tu navegador no puede grabar audio aquí. Usa HTTPS (o localhost) y un navegador
          moderno como Chrome, Safari, Firefox o Edge.
        </div>
      )}

      <div style={s.section}>
        <WaveformVisualizer analyser={analyser} active={recording} />
      </div>

      {recording && liveTranscript && (
        <div style={{ ...s.resultBox, marginBottom: 20, fontSize: 13 }}>
          <div style={s.label}>Escuchando en vivo…</div>
          {liveTranscript}
        </div>
      )}

      {recording && speechSupported && !liveTranscript && (
        <div
          style={{
            marginBottom: 20,
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            textAlign: "center",
          }}
        >
          Habla claro — el navegador captura el texto mientras grabas.
        </div>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
        {!recording ? (
          <button style={s.btn("orange")} onClick={startRecording} disabled={!micSupported}>
            <Icon d={icons.mic} size={17} stroke="#fff" />
            {audioBlob ? "Nueva Grabación" : "Iniciar Grabación"}
          </button>
        ) : (
          <button style={s.btn("danger")} onClick={stopRecording}>
            <Icon d={icons.stop} size={17} stroke="#fff" fill="#fff" />
            Detener Grabación
          </button>
        )}
      </div>

      {showTranscribeCta && freshRecording && (
        <div
          style={{
            marginBottom: 24,
            padding: "24px 28px",
            borderRadius: 20,
            background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))",
            border: "2px solid rgba(129,140,248,0.6)",
            boxShadow: "0 0 32px rgba(99,102,241,0.35)",
            animation: "glowPulse 2s ease-in-out infinite",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎙️</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
            ¡Audio grabado!
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 14,
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            Tu grabación está lista. Transcríbela con Whisper AI o usa la opción gratuita del
            navegador.
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                ...s.btn("primary"),
                fontSize: 16,
                padding: "14px 32px",
                boxShadow: "0 8px 28px rgba(99,102,241,0.5)",
              }}
              onClick={() => transcribeAudio()}
              disabled={loading.transcript}
            >
              <Icon d={icons.fileText} size={18} stroke="#fff" />
              {loading.transcript ? "Transcribiendo…" : "Transcribir (Whisper)"}
            </button>
            {speechSupported && (
              <button
                style={{
                  ...s.btn("ghost"),
                  fontSize: 15,
                  padding: "14px 24px",
                  borderColor: "rgba(34,197,94,0.4)",
                  color: "#86efac",
                }}
                onClick={transcribeWithBrowser}
                disabled={loading.transcript}
              >
                <Icon d={icons.fileText} size={17} />
                Transcribir gratis (navegador)
              </button>
            )}
          </div>
          {liveTranscript && (
            <div
              style={{
                marginTop: 20,
                padding: 14,
                borderRadius: 12,
                background: "rgba(0,0,0,0.2)",
                textAlign: "left",
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.6,
              }}
            >
              <div style={{ ...s.label, marginBottom: 6 }}>Texto capturado al grabar</div>
              {liveTranscript}
            </div>
          )}
        </div>
      )}

      {showTranscribeCta && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
          {!freshRecording && (
            <button
              style={s.btn("soft")}
              onClick={transcribeAudio}
              disabled={loading.transcript}
            >
              <Icon d={icons.fileText} size={17} />
              {loading.transcript ? "Transcribiendo…" : "Transcribir"}
            </button>
          )}
          <button style={s.btn("ghost")} onClick={generateSummary} disabled={loading.summary}>
            <Icon d={icons.sparkle} size={17} />
            {loading.summary ? "Resumiendo…" : "Generar Resumen"}
          </button>
        </div>
      )}

      {audioURL && (
        <div style={{ ...s.resultBox, padding: 16 }}>
          <div style={s.label}>Reproducir Grabación</div>
          <audio controls src={audioURL} style={{ width: "100%", accentColor: "#6366f1" }} />
        </div>
      )}

      {!audioBlob && (
        <div
          style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 16,
            border: "1.5px dashed rgba(255,255,255,0.1)",
            textAlign: "center",
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, lineHeight: 1.8 }}>
            💡 Haz clic en <strong style={{ color: "#a5b4fc" }}>Iniciar Grabación</strong> para
            comenzar.
            <br />
            El navegador pedirá permiso para usar el micrófono.
            <br />
            Al terminar verás la opción de <strong style={{ color: "#a5b4fc" }}>Transcribir</strong>{" "}
            resaltada.
          </div>
        </div>
      )}
    </div>
  );
}

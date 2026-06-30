import { icons } from "../../constants/icons";
import { Icon } from "../Icon";
import { styles as s } from "../../styles/styles";

export function TranscriptTab({
  transcript,
  setTranscript,
  loading,
  copied,
  copyText,
  translateTranscript,
  generateSummary,
  setChatMsgs,
  setTab,
  savedInHistory,
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
            Transcripción
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
            Texto generado automáticamente del audio
            {savedInHistory && (
              <span style={{ ...s.badge("green"), marginLeft: 10, fontSize: 11 }}>
                ☁ Guardada
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {transcript && (
            <>
              <button style={s.btn("ghost")} onClick={() => copyText(transcript)}>
                <Icon d={copied ? icons.check : icons.copy} size={15} />
                {copied ? "Copiado" : "Copiar"}
              </button>
              <button style={s.btn("soft")} onClick={translateTranscript}>
                <Icon d={icons.globe} size={15} />
                Traducir
              </button>
            </>
          )}
        </div>
      </div>

      {loading.transcript ? (
        <div style={{ ...s.resultBox, display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 20,
              height: 20,
              border: "2px solid #6366f1",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Transcribiendo audio con IA…</span>
        </div>
      ) : transcript ? (
        <div>
          <textarea
            style={s.textarea}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button style={s.btn("primary")} onClick={generateSummary} disabled={loading.summary}>
              <Icon d={icons.sparkle} size={15} stroke="#fff" />
              {loading.summary ? "Generando…" : "Generar Resumen IA"}
            </button>
            <button
              style={s.btn("ghost")}
              onClick={() => {
                setChatMsgs([]);
                setTab("chat");
              }}
            >
              <Icon d={icons.chat} size={15} />
              Chatear sobre esta reunión
            </button>
          </div>
        </div>
      ) : (
        <div style={{ ...s.resultBox, textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎙️</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
            No hay transcripción aún.
            <br />
            Ve a <strong style={{ color: "#a5b4fc" }}>Grabación</strong> y usa el botón{" "}
            <strong style={{ color: "#a5b4fc" }}>Transcribir</strong>.
          </div>
          <div style={{ marginTop: 16 }}>
            <button style={s.btn("orange")} onClick={() => setTab("record")}>
              <Icon d={icons.mic} size={15} /> Ir a Grabación
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

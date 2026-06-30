import { icons } from "../../constants/icons";
import { Icon } from "../Icon";
import { renderMd } from "../../utils/markdown";
import { styles as s } from "../../styles/styles";

export function SummaryTab({
  summary,
  transcript,
  loading,
  copied,
  copyText,
  generateSummary,
  setTab,
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
            Resumen Ejecutivo
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
            Análisis estructurado generado por IA
          </div>
        </div>
        {summary && (
          <button style={s.btn("ghost")} onClick={() => copyText(summary)}>
            <Icon d={copied ? icons.check : icons.copy} size={15} />
            {copied ? "Copiado" : "Copiar"}
          </button>
        )}
      </div>

      {loading.summary ? (
        <div style={{ ...s.resultBox, display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 20,
              height: 20,
              border: "2px solid #8b5cf6",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Generando resumen ejecutivo…</span>
        </div>
      ) : summary ? (
        <div>
          <div style={s.resultBox} dangerouslySetInnerHTML={{ __html: renderMd(summary) }} />
          <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
            <button style={s.btn("primary")} onClick={generateSummary}>
              <Icon d={icons.sparkle} size={15} stroke="#fff" />
              Regenerar
            </button>
            <button style={s.btn("ghost")} onClick={() => setTab("chat")}>
              <Icon d={icons.chat} size={15} />
              Hacer preguntas
            </button>
          </div>
        </div>
      ) : (
        <div style={{ ...s.resultBox, textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 20 }}>
            {transcript
              ? "Tienes una transcripción lista. Genera el resumen ahora."
              : "Primero transcribe el audio para generar el resumen."}
          </div>
          <button
            style={s.btn(transcript ? "primary" : "orange")}
            onClick={transcript ? generateSummary : () => setTab("record")}
            disabled={loading.summary}
          >
            <Icon d={transcript ? icons.sparkle : icons.mic} size={15} stroke="#fff" />
            {transcript ? "Generar Resumen" : "Ir a Grabación"}
          </button>
        </div>
      )}
    </div>
  );
}

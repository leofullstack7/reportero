import { useRef, useEffect } from "react";
import { icons } from "../../constants/icons";
import { Icon } from "../Icon";
import { styles as s } from "../../styles/styles";

const SUGGESTIONS = [
  "¿Cuáles fueron los acuerdos?",
  "Lista los participantes",
  "¿Qué tareas quedaron pendientes?",
  "Dame los puntos clave",
];

export function ChatTab({
  chatMsgs,
  chatInput,
  setChatInput,
  loading,
  sendChat,
  setChatMsgs,
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 440 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
          Chat Interactivo
        </div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
          Pregunta sobre la reunión o solicita análisis adicionales
        </div>
      </div>

      {chatMsgs.length === 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {SUGGESTIONS.map((q) => (
            <button
              key={q}
              style={{ ...s.btn("ghost"), fontSize: 12, padding: "7px 14px" }}
              onClick={() => setChatInput(q)}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 16,
          padding: "4px 0",
        }}
      >
        {chatMsgs.length === 0 ? (
          <div
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 14 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>💬</div>
              Escribe una pregunta sobre la reunión
            </div>
          </div>
        ) : (
          chatMsgs.map((m, i) => (
            <div
              key={i}
              style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}
            >
              <div style={s.chatBubble(m.role === "user")}>{m.content}</div>
            </div>
          ))
        )}
        {loading.chat && (
          <div style={{ display: "flex", gap: 6, padding: "12px 16px", alignSelf: "flex-start" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#6366f1",
                  animation: `pulse 1s ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          style={s.input}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendChat()}
          placeholder="Escribe tu pregunta sobre la reunión…"
        />
        <button
          style={{ ...s.btn("orange"), padding: "12px 18px" }}
          onClick={sendChat}
          disabled={loading.chat || !chatInput.trim()}
        >
          <Icon d={icons.send} size={17} stroke="#fff" fill="none" />
        </button>
      </div>
      {chatMsgs.length > 0 && (
        <button
          style={{
            ...s.btn("ghost"),
            marginTop: 8,
            fontSize: 12,
            padding: "6px 14px",
            alignSelf: "flex-start",
          }}
          onClick={() => setChatMsgs([])}
        >
          <Icon d={icons.trash} size={13} /> Limpiar chat
        </button>
      )}
    </div>
  );
}

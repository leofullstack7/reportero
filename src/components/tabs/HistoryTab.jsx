import { icons } from "../../constants/icons";
import { Icon } from "../Icon";
import { styles as s } from "../../styles/styles";

function formatDate(iso) {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sourceLabel(source) {
  return source === "browser" ? "Navegador" : "Whisper";
}

export function HistoryTab({
  history,
  historyLoading,
  supabaseConfigured,
  activeId,
  onOpen,
  onDelete,
  onRefresh,
  setTab,
}) {
  if (!supabaseConfigured) {
    return (
      <div style={{ ...s.resultBox, textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🗄️</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7 }}>
          Supabase no está configurado.
          <br />
          Agrega <code style={{ color: "#a5b4fc" }}>VITE_SUPABASE_URL</code> y{" "}
          <code style={{ color: "#a5b4fc" }}>VITE_SUPABASE_ANON_KEY</code> en tu archivo{" "}
          <code style={{ color: "#a5b4fc" }}>.env</code> y reinicia el servidor.
        </div>
      </div>
    );
  }

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
            Historial
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
            Solo tus transcripciones — privadas por cuenta
          </div>
        </div>
        <button style={s.btn("ghost")} onClick={onRefresh} disabled={historyLoading}>
          {historyLoading ? "Cargando…" : "Actualizar"}
        </button>
      </div>

      {historyLoading && history.length === 0 ? (
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
          <span style={{ color: "rgba(255,255,255,0.5)" }}>Cargando historial…</span>
        </div>
      ) : history.length === 0 ? (
        <div style={{ ...s.resultBox, textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 16 }}>
            Aún no hay transcripciones guardadas.
            <br />
            Graba y transcribe una reunión para verla aquí.
          </div>
          <button style={s.btn("orange")} onClick={() => setTab("record")}>
            <Icon d={icons.mic} size={15} /> Ir a Grabación
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {history.map((item) => (
            <div
              key={item.id}
              style={{
                ...s.resultBox,
                padding: "16px 18px",
                cursor: "pointer",
                borderColor:
                  activeId === item.id ? "rgba(129,140,248,0.6)" : "rgba(99,102,241,0.2)",
                background:
                  activeId === item.id ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.06)",
              }}
              onClick={() => onOpen(item)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#fff",
                      fontSize: 15,
                      marginBottom: 6,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.4)",
                      marginBottom: 8,
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>{formatDate(item.created_at)}</span>
                    <span>·</span>
                    <span>{sourceLabel(item.source)}</span>
                    {item.summary && (
                      <>
                        <span>·</span>
                        <span style={{ color: "#86efac" }}>Con resumen</span>
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.content}
                  </div>
                </div>
                <button
                  style={{ ...s.btn("ghost"), padding: "8px 10px", flexShrink: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  title="Eliminar"
                >
                  <Icon d={icons.trash} size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

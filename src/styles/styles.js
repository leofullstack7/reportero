export const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    width: "100%",
    padding: "28px 32px 0",
    display: "flex",
    alignItems: "center",
    gap: 16,
    maxWidth: 900,
  },
  title: { fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 },
  card: {
    width: "100%",
    maxWidth: 900,
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 24,
    margin: "24px 16px",
    overflow: "hidden",
  },
  tabBar: {
    display: "flex",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.2)",
    overflowX: "auto",
  },
  tab: (active) => ({
    flex: "0 0 auto",
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    gap: 7,
    cursor: "pointer",
    border: "none",
    outline: "none",
    background: active ? "rgba(249,115,22,0.15)" : "transparent",
    color: active ? "#fb923c" : "rgba(255,165,80,0.55)",
    fontWeight: active ? 700 : 500,
    fontSize: 13,
    borderBottom: active ? "2px solid #f97316" : "2px solid transparent",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  }),
  body: { padding: "28px 32px", minHeight: 420 },
  btn: (variant = "primary") => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "11px 22px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.2s",
    ...(variant === "primary"
      ? {
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff",
          boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
        }
      : variant === "danger"
        ? {
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "#fff",
            boxShadow: "0 4px 16px rgba(239,68,68,0.3)",
          }
        : variant === "ghost"
          ? {
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
            }
          : variant === "orange"
            ? {
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(249,115,22,0.35)",
              }
            : {
                background: "rgba(99,102,241,0.15)",
                color: "#a5b4fc",
                border: "1px solid rgba(99,102,241,0.3)",
              }),
  }),
  textarea: {
    width: "100%",
    minHeight: 180,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: 16,
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 1.7,
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  input: {
    flex: 1,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: "12px 16px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
  },
  select: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    padding: "9px 14px",
    color: "#fff",
    fontSize: 13,
    outline: "none",
    cursor: "pointer",
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
    display: "block",
  },
  section: { marginBottom: 24 },
  resultBox: {
    background: "rgba(99,102,241,0.06)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 14,
    padding: 20,
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 1.8,
    minHeight: 80,
  },
  chatBubble: (isUser) => ({
    maxWidth: "78%",
    padding: "12px 16px",
    borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    background: isUser
      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
      : "rgba(255,255,255,0.07)",
    color: isUser ? "#fff" : "rgba(255,255,255,0.9)",
    fontSize: 14,
    lineHeight: 1.6,
    border: isUser ? "none" : "1px solid rgba(255,255,255,0.1)",
    alignSelf: isUser ? "flex-end" : "flex-start",
    whiteSpace: "pre-wrap",
  }),
  badge: (color = "purple") => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    background:
      color === "purple"
        ? "rgba(99,102,241,0.2)"
        : color === "green"
          ? "rgba(34,197,94,0.2)"
          : "rgba(239,68,68,0.2)",
    color:
      color === "purple"
        ? "#a5b4fc"
        : color === "green"
          ? "#86efac"
          : "#fca5a5",
    border: `1px solid ${
      color === "purple"
        ? "rgba(99,102,241,0.3)"
        : color === "green"
          ? "rgba(34,197,94,0.3)"
          : "rgba(239,68,68,0.3)"
    }`,
  }),
};

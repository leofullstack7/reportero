export function Notification({ notification }) {
  if (!notification) return null;

  const bg =
    notification.type === "success"
      ? "rgba(34,197,94,0.9)"
      : notification.type === "error"
        ? "rgba(239,68,68,0.9)"
        : "rgba(99,102,241,0.9)";

  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 1000,
        background: bg,
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 600,
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        animation: "slideIn 0.3s ease",
        maxWidth: "min(90vw, 420px)",
      }}
    >
      {notification.msg}
    </div>
  );
}

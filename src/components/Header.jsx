import { LOGO_SRC } from "../assets/logo";
import { styles as s } from "../styles/styles";

export function Header({ audioBlob, user, onSignOut }) {
  return (
    <div className="app-header" style={s.header}>
      <div className="app-header-brand" style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
        <img
          src={LOGO_SRC}
          alt="La Sastrería Digital"
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            objectFit: "cover",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            border: "2px solid rgba(255,255,255,0.15)",
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0 }}>
          <div style={s.title}>El Reportero</div>
          {user?.email && (
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                marginTop: 2,
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.email}
            </div>
          )}
        </div>
      </div>
      <div className="app-header-actions" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        {audioBlob && (
          <div className="header-audio-badge" style={s.badge("green")}>
            <span>●</span> Audio listo
          </div>
        )}
        <button
          className="header-signout-btn"
          style={{ ...s.btn("ghost"), padding: "8px 14px", fontSize: 12 }}
          onClick={onSignOut}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { LOGO_SRC } from "../assets/logo";
import { formatAuthError } from "../utils/authErrors";
import { styles as s } from "../styles/styles";

export function AuthPanel({ signIn, signUp, supabaseConfigured }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (!supabaseConfigured) {
    return (
      <div style={s.app}>
        <div style={{ ...s.card, maxWidth: 440, margin: "80px 16px" }}>
          <div style={{ ...s.body, textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.6)" }}>
              Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(email.trim(), password);
      } else {
        const data = await signUp(email.trim(), password);
        if (data.session) {
          setMessage({ type: "success", text: "Cuenta creada. Bienvenido." });
        } else {
          setMessage({
            type: "info",
            text: "Revisa tu correo y confirma la cuenta antes de iniciar sesión.",
          });
          setMode("login");
        }
      }
    } catch (err) {
      setMessage({ type: "error", text: formatAuthError(err) });
    }

    setLoading(false);
  };

  return (
    <div style={s.app}>
      <div style={{ ...s.card, maxWidth: 440, margin: "48px 16px" }}>
        <div style={{ ...s.body, padding: "36px 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <img
              src={LOGO_SRC}
              alt="El Reportero"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            />
            <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
              El Reportero
            </div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
              {mode === "login"
                ? "Inicia sesión para ver tu historial"
                : "Crea tu cuenta con email"}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={s.label}>Correo electrónico</label>
              <input
                style={{ ...s.input, width: "100%" }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label style={s.label}>Contraseña</label>
              <input
                style={{ ...s.input, width: "100%" }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>

            {message && (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  fontSize: 13,
                  lineHeight: 1.5,
                  background:
                    message.type === "error"
                      ? "rgba(239,68,68,0.15)"
                      : message.type === "success"
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(99,102,241,0.15)",
                  color:
                    message.type === "error"
                      ? "#fca5a5"
                      : message.type === "success"
                        ? "#86efac"
                        : "#a5b4fc",
                  border: `1px solid ${
                    message.type === "error"
                      ? "rgba(239,68,68,0.3)"
                      : message.type === "success"
                        ? "rgba(34,197,94,0.3)"
                        : "rgba(99,102,241,0.3)"
                  }`,
                }}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              style={{ ...s.btn("orange"), width: "100%", justifyContent: "center", marginTop: 4 }}
              disabled={loading}
            >
              {loading
                ? "Espera…"
                : mode === "login"
                  ? "Iniciar sesión"
                  : "Crear cuenta"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
            {mode === "login" ? (
              <span style={{ color: "rgba(255,255,255,0.45)" }}>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setMessage(null);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fb923c",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  Regístrate
                </button>
              </span>
            ) : (
              <span style={{ color: "rgba(255,255,255,0.45)" }}>
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setMessage(null);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fb923c",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  Inicia sesión
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

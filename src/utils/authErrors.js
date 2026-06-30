export function formatAuthError(err) {
  const msg = err?.message || String(err);

  if (msg === "Failed to fetch" || msg.includes("NetworkError")) {
    return "No se pudo conectar con Supabase. Verifica VITE_SUPABASE_URL en .env (copia la URL exacta del dashboard) y reinicia npm run dev.";
  }

  if (msg === "Invalid login credentials") {
    return "Correo o contraseña incorrectos.";
  }

  if (msg === "User already registered") {
    return "Este correo ya está registrado. Inicia sesión.";
  }

  if (msg.includes("Password should be at least")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }

  if (msg.includes("Unable to validate email")) {
    return "El correo no es válido.";
  }

  return msg || "Error de autenticación";
}

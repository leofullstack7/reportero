export function isQuotaError(message = "", code = "") {
  return (
    code === "insufficient_quota" ||
    /quota|insufficient_quota|exceeded your current quota/i.test(message)
  );
}

export function formatOpenAIError(apiError = {}) {
  const message =
    typeof apiError === "string" ? apiError : apiError.message || "";
  const code = typeof apiError === "object" ? apiError.code || apiError.type : "";

  if (isQuotaError(message, code)) {
    return {
      code: "QUOTA_EXCEEDED",
      message:
        "OpenAI rechazó la petición (sin cuota de API). Los $20 de ChatGPT Plus no activan la API automáticamente. Entra a platform.openai.com → Settings → Billing, agrega método de pago y compra créditos de API. Mientras tanto usa «Transcribir gratis (navegador)».",
    };
  }

  if (/invalid_api_key|incorrect api key/i.test(message)) {
    return {
      code: "INVALID_KEY",
      message: "API key inválida. Genera una nueva en platform.openai.com/api-keys.",
    };
  }

  if (/rate_limit|too many requests/i.test(message)) {
    return {
      code: "RATE_LIMIT",
      message: "Demasiadas peticiones. Espera un momento e intenta de nuevo.",
    };
  }

  return { code: "GENERIC", message: message || "Error al conectar con OpenAI." };
}

// URL base de la API web.
// En build de APK/Play Store usamos Vercel como fallback para no depender de .env local.
const DEFAULT_API_URL = "https://historia-merengue-web.vercel.app";

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL?.trim() || DEFAULT_API_URL
).replace(/\/$/, "");

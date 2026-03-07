// URL base de la API web. Configura EXPO_PUBLIC_API_URL en .env.local
// Ejemplo producción: EXPO_PUBLIC_API_URL=https://tu-proyecto.vercel.app
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

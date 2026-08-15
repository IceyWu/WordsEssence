// Centralised environment access.

/** Base URL of the upstream Go API. Server-side only. */
export const API_BASE_URL =
  process.env.API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:6002";

/** Base URL of the AI OCR task service. Server-side only. */
export const AI_BASE_URL =
  process.env.AI_BASE_URL?.replace(/\/$/, "") ?? "https://api.lpalette.cn";

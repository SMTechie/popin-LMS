export const AUTH_BYPASS =
  (import.meta.env.VITE_AUTH_BYPASS ?? (import.meta.env.DEV ? "true" : "false")) === "true";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const TOKEN_KEY = "popin_access_token";

type RequestOptions = RequestInit & { auth?: boolean };

export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export async function apiRequest<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const resolvedHeaders = new Headers(headers || {});

  if (auth) {
    const token = tokenStorage.get();
    if (token) resolvedHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (rest.body && !resolvedHeaders.has("Content-Type")) {
    resolvedHeaders.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: resolvedHeaders
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text || res.statusText;
    try {
      const data = JSON.parse(text);
      message = Array.isArray(data.message) ? data.message.join('; ') : data.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (res.status === 204) return null as T;

  return res.json();
}

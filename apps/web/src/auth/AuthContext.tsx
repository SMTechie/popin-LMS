import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, tokenStorage } from "../lib/api";

interface AuthContextValue {
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = tokenStorage.get();
    if (stored) setToken(stored);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiRequest<{ accessToken: string }>("/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password })
    });
    tokenStorage.set(data.accessToken);
    setToken(data.accessToken);
  };

  const signup = async (email: string, password: string, name?: string) => {
    const data = await apiRequest<{ accessToken: string }>("/auth/signup", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password, name })
    });
    tokenStorage.set(data.accessToken);
    setToken(data.accessToken);
  };

  const logout = () => {
    tokenStorage.clear();
    setToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      signup,
      logout
    }),
    [token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

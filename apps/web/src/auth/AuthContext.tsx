/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) throw new Error("Enter an email and password.");
    const response = await apiRequest<{ token: string }>("/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password })
    });
    tokenStorage.set(response.token);
    setToken(response.token);
  }, []);

  const signup = useCallback(async (email: string, password: string, name?: string) => {
    if (!email || !password || !name) throw new Error("Enter your name, email and password.");
    const response = await apiRequest<{ token: string }>("/auth/signup", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password, name })
    });
    tokenStorage.set(response.token);
    setToken(response.token);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      loading,
      isAuthenticated: Boolean(token),
      login,
      signup,
      logout
    }),
    [token, loading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

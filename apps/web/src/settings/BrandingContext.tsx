import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, tokenStorage } from "../lib/api";
import { toRgbChannels } from "../lib/brand";

export type BrandingSettings = {
  schoolName?: string;
  schoolMotto?: string;
  primaryColor?: string;
  accentColor?: string;
  email?: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
};

type BrandingContextValue = {
  branding: BrandingSettings | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setBrandingLocal: (value: BrandingSettings) => void;
};

const BRANDING_KEY = "popin_branding";

const BrandingContext = createContext<BrandingContextValue | null>(null);

function readLocal(): BrandingSettings | null {
  const raw = localStorage.getItem(BRANDING_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BrandingSettings;
  } catch {
    return null;
  }
}

function writeLocal(value: BrandingSettings) {
  localStorage.setItem(BRANDING_KEY, JSON.stringify(value));
}

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<BrandingSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const token = tokenStorage.get();
    if (!token) {
      setBranding(null);
      setLoading(false);
      return;
    }

    const local = readLocal();
    if (local) setBranding(local);

    try {
      const res = await apiRequest<{ key: string; value: BrandingSettings | null }>("/settings/branding");
      const value = res?.value || null;
      if (value) {
        setBranding(value);
        writeLocal(value);
      }
    } catch {
      // ignore fetch errors; local cache still used
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === BRANDING_KEY && event.newValue) {
        try {
          setBranding(JSON.parse(event.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const applyBrandingVars = (value: BrandingSettings) => {
    const root = document.documentElement;
    if (value.primaryColor) {
      const rgb = toRgbChannels(value.primaryColor);
      if (rgb) root.style.setProperty("--brand-primary", rgb);
    }
    if (value.accentColor) {
      const rgb = toRgbChannels(value.accentColor);
      if (rgb) root.style.setProperty("--brand-accent", rgb);
    }
  };

  const setBrandingLocal = (value: BrandingSettings) => {
    setBranding(value);
    writeLocal(value);
    applyBrandingVars(value);
  };

  const value = useMemo(
    () => ({ branding, loading, refresh, setBrandingLocal }),
    [branding, loading]
  );

  useEffect(() => {
    if (branding) applyBrandingVars(branding);
  }, [branding]);

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
}

export function useBranding() {
  const ctx = useContext(BrandingContext);
  if (!ctx) throw new Error("useBranding must be used within BrandingProvider");
  return ctx;
}

import { useEffect } from "react";

export default function PwaRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch {
        // ignore registration errors in unsupported/local states
      }
    };

    void register();
  }, []);

  return null;
}

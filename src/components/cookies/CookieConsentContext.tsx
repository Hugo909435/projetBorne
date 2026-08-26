"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { CONSENT_STORAGE_KEY, updateAnalyticsConsent } from "@/lib/analytics";

/** null: no decision stored yet. undefined: not read yet (SSR / pre-hydration). */
type StoredChoice = boolean | null | undefined;

type CookieConsentContextValue = {
  choice: boolean | null;
  bannerOpen: boolean;
  /** Whether it's safe to show the floating settings button (decision known, banner closed). */
  floatingVisible: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (analytics: boolean) => void;
  openPreferences: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

// A primitive return value, so useSyncExternalStore's Object.is check sees a
// stable snapshot between calls instead of a new object every render.
function readStoredChoice(): boolean | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed?.analytics === "boolean" ? parsed.analytics : null;
  } catch {
    return null;
  }
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

// The server can't know localStorage, so it reports "not read yet" rather than
// guessing "no consent" — the latter would flash the banner open for visitors
// who already answered, right before the real value swaps it away.
function getServerSnapshot(): StoredChoice {
  return undefined;
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const storedChoice = useSyncExternalStore<StoredChoice>(subscribeToStorage, readStoredChoice, getServerSnapshot);
  // Set only when the user acts in this tab, so their click reflects immediately
  // without waiting on the storage-event round trip that only fires for other tabs.
  const [override, setOverride] = useState<boolean | undefined>(undefined);
  const [forceOpen, setForceOpen] = useState(false);

  const resolved = override !== undefined ? override : storedChoice;
  const ready = resolved !== undefined;
  const choice = ready ? (resolved as boolean | null) : null;
  const bannerOpen = ready && (choice === null || forceOpen);
  const floatingVisible = ready && !bannerOpen;

  const persist = useCallback((analytics: boolean) => {
    setOverride(analytics);
    setForceOpen(false);
    updateAnalyticsConsent(analytics);
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ analytics }));
    } catch {
      // localStorage unavailable (private browsing, quota) — consent still applies for this session.
    }
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      choice,
      bannerOpen,
      floatingVisible,
      acceptAll: () => persist(true),
      rejectAll: () => persist(false),
      savePreferences: persist,
      openPreferences: () => setForceOpen(true),
    }),
    [choice, bannerOpen, floatingVisible, persist]
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  return ctx;
}

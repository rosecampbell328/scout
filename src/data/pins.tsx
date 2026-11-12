import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, use, useEffect, useState, type ReactNode } from "react";

import { seedPins } from "./seed";
import type { NewPin, Pin } from "./types";

const STORAGE_KEY = "scout.pins.v1";

type PinsContextValue = {
  pins: Pin[];
  ready: boolean;
  addPin: (pin: NewPin) => Pin;
  getPin: (id: string) => Pin | undefined;
};

const PinsContext = createContext<PinsContextValue | null>(null);

/**
 * Pin store. Currently persists on-device with AsyncStorage.
 * To make pins shared between photographers, swap the load/save
 * calls here for a backend (e.g. Supabase or Firebase) — screens
 * only talk to this context, so nothing else needs to change.
 */
export function PinsProvider({ children }: { children: ReactNode }) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setPins(raw ? (JSON.parse(raw) as Pin[]) : seedPins))
      .catch(() => setPins(seedPins))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pins)).catch(() => {});
  }, [pins, ready]);

  const addPin = (input: NewPin) => {
    const pin: Pin = { ...input, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: Date.now() };
    setPins((prev) => [pin, ...prev]);
    return pin;
  };

  const getPin = (id: string) => pins.find((p) => p.id === id);

  return <PinsContext value={{ pins, ready, addPin, getPin }}>{children}</PinsContext>;
}

export function usePins() {
  const ctx = use(PinsContext);
  if (!ctx) throw new Error("usePins must be used inside <PinsProvider>");
  return ctx;
}

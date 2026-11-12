import { createContext, use, type ReactNode } from "react";

import { seedPins } from "./seed";
import { ME, type NewPin, type Pin } from "./types";
import { usePersistedState } from "./usePersistedState";

type PinsContextValue = {
  pins: Pin[];
  ready: boolean;
  addPin: (pin: NewPin) => Pin;
  getPin: (id: string) => Pin | undefined;
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
};

const PinsContext = createContext<PinsContextValue | null>(null);

/**
 * Upgrade pins saved by earlier versions:
 * - pins saved before `ownerId` existed: anything that isn't a seed pin was made on this device
 * - pins saved before `address` existed: starter pins get theirs, others get ""
 * - add any starter pins that were added to the app after the data was first saved
 */
const migratePins = (stored: Pin[]) => {
  const pins = stored.map((p) => ({
    ...p,
    ownerId: p.ownerId ?? (p.id.startsWith("seed-") ? "scout" : ME),
    address: p.address ?? seedPins.find((s) => s.id === p.id)?.address ?? "",
  }));
  const ids = new Set(pins.map((p) => p.id));
  return [...pins, ...seedPins.filter((s) => !ids.has(s.id))];
};

/**
 * Pin + favorites store. Currently persists on-device with AsyncStorage.
 * To make pins shared between photographers, swap this for a backend
 * (e.g. Supabase or Firebase) — screens only talk to this context.
 */
export function PinsProvider({ children }: { children: ReactNode }) {
  const [pins, setPins, pinsReady] = usePersistedState<Pin[]>(
    "scout.pins.v1",
    seedPins,
    migratePins,
  );
  const [favoriteIds, setFavoriteIds, favReady] = usePersistedState<string[]>(
    "scout.favorites.v1",
    [],
  );

  const addPin = (input: NewPin) => {
    const pin: Pin = {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ownerId: ME,
      createdAt: Date.now(),
    };
    setPins((prev) => [pin, ...prev]);
    return pin;
  };

  const getPin = (id: string) => pins.find((p) => p.id === id);
  const isFavorite = (id: string) => favoriteIds.includes(id);
  const toggleFavorite = (id: string) =>
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [id, ...prev],
    );

  return (
    <PinsContext
      value={{
        pins,
        ready: pinsReady && favReady,
        addPin,
        getPin,
        favoriteIds,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </PinsContext>
  );
}

export function usePins() {
  const ctx = use(PinsContext);
  if (!ctx) throw new Error("usePins must be used inside <PinsProvider>");
  return ctx;
}

/** Case-insensitive keyword match against a pin's title, notes, tags and author. */
export function pinMatches(pin: Pin, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [pin.title, pin.description, pin.author, ...pin.tags].some((s) =>
    s.toLowerCase().includes(q),
  );
}

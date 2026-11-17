import { createContext, use, type ReactNode } from "react";

import type { PlanId } from "./plans";
import { usePersistedState } from "./usePersistedState";

export type Role = "professional" | "hobbyist" | "client";

export type Session = {
  role: Role | null;
  /** Signed-in account. Local only for now; no password is stored. */
  account: { name: string; email: string } | null;
  subscription: {
    plan: PlanId;
    status: "trial" | "active";
    startedAt: number;
  } | null;
};

const EMPTY: Session = { role: null, account: null, subscription: null };

type SessionContextValue = Session & {
  ready: boolean;
  /** Finished welcome → role → account → paywall. */
  onboarded: boolean;
  setRole: (role: Role) => void;
  signIn: (account: { name: string; email: string }) => void;
  startSubscription: (plan: PlanId, status: "trial" | "active") => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

/**
 * Onboarding + account state, saved on the device.
 * TODO: back `signIn` with real auth (e.g. Supabase, Firebase, Clerk) and
 * `startSubscription` with in-app purchases (e.g. RevenueCat).
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession, ready] = usePersistedState<Session>(
    "scout.session.v1",
    EMPTY,
  );

  const value: SessionContextValue = {
    ...session,
    ready,
    onboarded: session.account !== null && session.subscription !== null,
    setRole: (role) => setSession((s) => ({ ...s, role })),
    signIn: (account) => setSession((s) => ({ ...s, account })),
    startSubscription: (plan, status) =>
      setSession((s) => ({
        ...s,
        subscription: { plan, status, startedAt: Date.now() },
      })),
    signOut: () => setSession(EMPTY),
  };

  return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession() {
  const ctx = use(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}

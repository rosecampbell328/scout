/**
 * Subscription plans shown on the paywall.
 * PLACEHOLDER PRICES: set real prices in App Store Connect / Google Play
 * and load them from the store (e.g. via RevenueCat) before launch.
 */
export type PlanId = "yearly" | "monthly";

export type Plan = {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  /** Small line under the price. */
  note: string;
  badge?: string;
};

export const TRIAL_DAYS = 7;

export const plans: Plan[] = [
  {
    id: "yearly",
    name: "Yearly",
    price: "$39.99",
    period: "year",
    note: "Just $3.33 a month",
    badge: "Best value",
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "$4.99",
    period: "month",
    note: "Cancel anytime",
  },
];

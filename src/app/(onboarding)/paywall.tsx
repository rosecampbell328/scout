import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { OnboardingFrame } from "@/components/OnboardingFrame";
import { plans, TRIAL_DAYS, type PlanId } from "@/data/plans";
import { useSession } from "@/data/session";
import { colors, fonts, labelText, spacing } from "@/theme";

const BENEFITS = [
  "Every location pinned by photographers across the US",
  "Search any city and see what's nearby",
  "Save unlimited favorites",
  "Share your own spots and build your profile",
];

export default function Paywall() {
  const { startSubscription } = useSession();
  const [planId, setPlanId] = useState<PlanId>("yearly");
  const plan = plans.find((p) => p.id === planId)!;

  // TODO: run the real purchase (e.g. RevenueCat) before starting the subscription.
  // Finishing onboarding flips the route guard and lands on the map.
  const startTrial = () => startSubscription(planId, "trial");
  const subscribe = () => startSubscription(planId, "active");

  return (
    <OnboardingFrame
      step={3}
      title="Scout everywhere"
      subtitle={`Try everything free for ${TRIAL_DAYS} days.`}
      footer={
        <>
          <Button
            title={`Start ${TRIAL_DAYS}-day free trial`}
            onPress={startTrial}
          />
          <Text style={styles.fine}>
            Free for {TRIAL_DAYS} days, then {plan.price}/{plan.period}. Cancel
            anytime.
          </Text>
          <Button
            title={`Subscribe now · ${plan.price}/${plan.period}`}
            variant="outline"
            onPress={subscribe}
          />
        </>
      }
    >
      <View style={styles.benefits}>
        {BENEFITS.map((b) => (
          <View key={b} style={styles.benefit}>
            <Ionicons name="checkmark" size={18} color={colors.text} />
            <Text style={styles.benefitText}>{b}</Text>
          </View>
        ))}
      </View>

      {plans.map((p) => {
        const selected = p.id === planId;
        return (
          <Pressable
            key={p.id}
            onPress={() => setPlanId(p.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[styles.plan, selected && styles.planOn]}
          >
            <Ionicons
              name={selected ? "radio-button-on" : "radio-button-off"}
              size={22}
              color={selected ? colors.text : colors.border}
            />
            <View style={styles.planText}>
              <Text style={styles.planName}>{p.name}</Text>
              <Text style={styles.planNote}>{p.note}</Text>
            </View>
            <View style={styles.planPrice}>
              {p.badge ? (
                <Text style={[labelText, styles.badge]}>{p.badge}</Text>
              ) : null}
              <Text style={styles.price}>
                {p.price}
                <Text style={styles.period}>/{p.period}</Text>
              </Text>
            </View>
          </Pressable>
        );
      })}
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  benefits: { gap: spacing.sm, marginBottom: spacing.sm },
  benefit: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" },
  benefitText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text,
  },
  plan: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  planOn: { borderWidth: 1.5, borderColor: colors.text },
  planText: { flex: 1, gap: 2 },
  planName: { fontFamily: fonts.display, fontSize: 22, color: colors.text },
  planNote: {
    fontFamily: fonts.bodyLight,
    fontSize: 13,
    color: colors.textMuted,
  },
  planPrice: { alignItems: "flex-end", gap: 4 },
  badge: {
    fontSize: 8,
    color: colors.buttonText,
    backgroundColor: colors.button,
    paddingHorizontal: 6,
    paddingVertical: 3,
    overflow: "hidden",
  },
  price: { fontFamily: fonts.display, fontSize: 22, color: colors.text },
  period: {
    fontFamily: fonts.bodyLight,
    fontSize: 13,
    color: colors.textMuted,
  },
  fine: {
    fontFamily: fonts.bodyLight,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
  },
});

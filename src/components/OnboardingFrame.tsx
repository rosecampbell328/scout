import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fonts, labelText, spacing } from "@/theme";

type Props = {
  /** e.g. 1 for "Step 1 of 3". Omit to hide the step label. */
  step?: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Buttons pinned to the bottom of the screen. */
  footer: ReactNode;
};

const TOTAL_STEPS = 3;

/** Shared layout for the onboarding screens after the welcome page. */
export function OnboardingFrame({
  step,
  title,
  subtitle,
  children,
  footer,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {step ? (
          <View style={styles.steps}>
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <View
                key={i}
                style={[styles.stepBar, i < step && styles.stepBarOn]}
              />
            ))}
          </View>
        ) : null}
        {step ? (
          <Text style={[labelText, styles.stepLabel]}>
            Step {step} of {TOTAL_STEPS}
          </Text>
        ) : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <View style={styles.body}>{children}</View>
      </ScrollView>
      <View
        style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}
      >
        {footer}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  steps: { flexDirection: "row", gap: 6, paddingTop: spacing.sm },
  stepBar: { flex: 1, height: 2, backgroundColor: colors.border },
  stepBarOn: { backgroundColor: colors.text },
  stepLabel: { fontSize: 9, color: colors.textMuted, marginTop: spacing.md },
  title: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 38,
    color: colors.text,
    marginTop: spacing.sm,
  },
  subtitle: {
    fontFamily: fonts.displayItalic,
    fontSize: 18,
    lineHeight: 24,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  body: { marginTop: spacing.xl, gap: spacing.md },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
});

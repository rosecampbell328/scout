import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fonts, spacing } from "@/theme";

/** Top bar used on every tab: SCOUT wordmark on the left, optional content on the right. */
export function AppHeader({
  right,
  children,
}: {
  right?: ReactNode;
  children?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.row}>
        <Text style={styles.wordmark}>SCOUT</Text>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 40,
    gap: spacing.md,
  },
  wordmark: {
    fontFamily: fonts.display,
    fontSize: 26,
    letterSpacing: 7,
    color: colors.text,
  },
  right: { flex: 1, alignItems: "flex-end" },
});

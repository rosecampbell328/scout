import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

import { colors, fonts, labelText, spacing } from "@/theme";

export type SuggestionRow = {
  key: string;
  title: string;
  subtitle?: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  iconColor?: string;
  onPress: () => void;
};

type Props = {
  rows: SuggestionRow[];
  loading?: boolean;
  /** Small caption shown above each group, keyed by the first row of that group. */
  headings?: Record<string, string>;
  style?: ViewStyle;
};

/** Dropdown of search suggestions shown under a text field. */
export function SuggestionList({ rows, loading, headings = {}, style }: Props) {
  if (rows.length === 0 && !loading) return null;
  return (
    <View style={[styles.wrap, style]}>
      {rows.map((row) => (
        <View key={row.key}>
          {headings[row.key] ? (
            <Text style={[labelText, styles.heading]}>{headings[row.key]}</Text>
          ) : null}
          <Pressable
            style={({ pressed }) => [
              styles.row,
              pressed && { backgroundColor: colors.divider },
            ]}
            onPress={row.onPress}
          >
            <Ionicons
              name={row.icon}
              size={16}
              color={row.iconColor ?? colors.textMuted}
            />
            <View style={styles.text}>
              <Text style={styles.title} numberOfLines={1}>
                {row.title}
              </Text>
              {row.subtitle ? (
                <Text style={styles.subtitle} numberOfLines={1}>
                  {row.subtitle}
                </Text>
              ) : null}
            </View>
          </Pressable>
        </View>
      ))}
      {loading && rows.length === 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={colors.textMuted} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  heading: {
    fontSize: 9,
    color: colors.textMuted,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  text: { flex: 1 },
  title: { fontFamily: fonts.body, fontSize: 15, color: colors.text },
  subtitle: {
    fontFamily: fonts.bodyLight,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  loading: { paddingVertical: 12 },
});

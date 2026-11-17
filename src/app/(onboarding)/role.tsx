import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { OnboardingFrame } from "@/components/OnboardingFrame";
import { useSession, type Role } from "@/data/session";
import { colors, fonts, spacing } from "@/theme";

const ROLES: {
  id: Role;
  title: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>["name"];
}[] = [
  {
    id: "professional",
    title: "Professional photographer",
    description: "Scout spots for client sessions and share your favorites.",
    icon: "camera-outline",
  },
  {
    id: "hobbyist",
    title: "Student / hobbyist photographer",
    description: "Find new places to practice and build your portfolio.",
    icon: "aperture-outline",
  },
  {
    id: "client",
    title: "Just looking to get some pictures!",
    description: "Find a beautiful spot and the photographers who shoot there.",
    icon: "images-outline",
  },
];

export default function RoleScreen() {
  const { role, setRole } = useSession();

  return (
    <OnboardingFrame
      step={1}
      title="Which describes you best?"
      subtitle="We'll tailor Scout to how you shoot."
      footer={
        <Button
          title="Continue"
          disabled={!role}
          onPress={() => router.push("/account")}
        />
      }
    >
      {ROLES.map((r) => {
        const selected = role === r.id;
        return (
          <Pressable
            key={r.id}
            onPress={() => setRole(r.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={({ pressed }) => [
              styles.card,
              selected && styles.cardOn,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Ionicons
              name={r.icon}
              size={26}
              color={selected ? colors.buttonText : colors.text}
            />
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, selected && styles.textOn]}>
                {r.title}
              </Text>
              <Text style={[styles.cardDesc, selected && styles.textOnMuted]}>
                {r.description}
              </Text>
            </View>
            <Ionicons
              name={selected ? "checkmark-circle" : "ellipse-outline"}
              size={22}
              color={selected ? colors.buttonText : colors.border}
            />
          </Pressable>
        );
      })}
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  cardOn: { backgroundColor: colors.button, borderColor: colors.button },
  cardText: { flex: 1, gap: 4 },
  cardTitle: { fontFamily: fonts.display, fontSize: 21, color: colors.text },
  cardDesc: {
    fontFamily: fonts.bodyLight,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  textOn: { color: colors.buttonText },
  textOnMuted: { color: colors.border },
});

import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { colors, fonts, spacing } from "@/theme";

const PIN = require("@/assets/images/pin.png");

export default function Welcome() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.lg,
        },
      ]}
    >
      <Text style={styles.wordmark}>SCOUT</Text>

      <View style={styles.hero}>
        <Image source={PIN} style={styles.pin} contentFit="contain" />
        <Text style={styles.title}>Welcome to Scout</Text>
        <Text style={styles.subtitle}>
          Find and share the best photoshoot locations across the US, scouted by
          photographers like you.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button title="Get started" onPress={() => router.push("/role")} />
        <Pressable
          onPress={() =>
            router.push({ pathname: "/account", params: { mode: "login" } })
          }
          hitSlop={8}
          style={styles.login}
        >
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginLink}>Log in</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  wordmark: {
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: 8,
    color: colors.text,
    textAlign: "center",
  },
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  pin: { width: 46, height: 68, marginBottom: spacing.md },
  title: {
    fontFamily: fonts.display,
    fontSize: 44,
    lineHeight: 48,
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fonts.displayItalic,
    fontSize: 20,
    lineHeight: 27,
    color: colors.textMuted,
    textAlign: "center",
    maxWidth: 320,
  },
  actions: { gap: spacing.md },
  login: { alignSelf: "center", padding: spacing.xs },
  loginText: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted },
  loginLink: { color: colors.text, textDecorationLine: "underline" },
});

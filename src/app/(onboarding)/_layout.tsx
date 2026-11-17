import { Stack } from "expo-router";

import { colors } from "@/theme";

export const unstable_settings = { anchor: "welcome" };

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        title: "",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerBackButtonDisplayMode: "minimal",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
    </Stack>
  );
}

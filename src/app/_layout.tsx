import {
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_500Medium,
} from "@expo-google-fonts/cormorant-garamond";
import {
  Jost_300Light,
  Jost_400Regular,
  Jost_500Medium,
  useFonts,
} from "@expo-google-fonts/jost";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { PinsProvider } from "@/data/pins";
import { ProfileProvider } from "@/data/profile";
import { SessionProvider, useSession } from "@/data/session";
import { colors, fonts } from "@/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    CormorantGaramond_500Medium,
    CormorantGaramond_400Regular_Italic,
    Jost_300Light,
    Jost_400Regular,
    Jost_500Medium,
  });

  if (!loaded && !error) return null;

  return (
    <SessionProvider>
      <ProfileProvider>
        <PinsProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </PinsProvider>
      </ProfileProvider>
    </SessionProvider>
  );
}

function RootNavigator() {
  const { ready, onboarded } = useSession();

  // Keep the splash screen up until we know whether to show onboarding.
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: fonts.display, fontSize: 20 },
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      {/* First launch: welcome → role → account → paywall. */}
      <Stack.Protected guard={!onboarded} redirectTo="/">
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={onboarded} redirectTo="/welcome">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add"
          options={{ presentation: "modal", title: "New Location" }}
        />
        <Stack.Screen
          name="edit-profile"
          options={{ presentation: "modal", title: "Edit Profile" }}
        />
        <Stack.Screen name="pin/[id]" options={{ title: "" }} />
        <Stack.Screen name="user/[id]" options={{ title: "" }} />
      </Stack.Protected>
    </Stack>
  );
}

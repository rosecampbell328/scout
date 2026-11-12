import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Tabs } from "expo-router/js-tabs";
import { StyleSheet, View } from "react-native";

import { useProfile } from "@/data/profile";
import { colors } from "@/theme";

/** Instagram-style bottom bar: Map · Favorites · Profile (icons only). */
export default function TabsLayout() {
  const { profile } = useProfile();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "map" : "map-outline"}
              size={25}
              color={focused ? colors.tabActive : colors.tabInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={26}
              color={focused ? colors.tabActive : colors.tabInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) =>
            profile.photoUri ? (
              <View
                style={[
                  styles.avatarRing,
                  focused && { borderColor: colors.tabActive },
                ]}
              >
                <Image
                  source={{ uri: profile.photoUri }}
                  style={styles.avatar}
                />
              </View>
            ) : (
              <Ionicons
                name={focused ? "person-circle" : "person-circle-outline"}
                size={28}
                color={focused ? colors.tabActive : colors.tabInactive}
              />
            ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  avatarRing: {
    padding: 1.5,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  avatar: { width: 26, height: 26, borderRadius: 13 },
});

import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/Button";
import { PinGrid } from "@/components/PinGrid";
import { usePins } from "@/data/pins";
import { useProfile } from "@/data/profile";
import { ME } from "@/data/types";
import { colors, fonts, labelText, spacing } from "@/theme";

export default function ProfileScreen() {
  const { profile } = useProfile();
  const { pins, favoriteIds } = usePins();
  const myPins = pins.filter((p) => p.ownerId === ME);
  const editProfile = () => router.push("/edit-profile");

  return (
    <View style={styles.container}>
      <AppHeader
        right={
          <Pressable onPress={editProfile} hitSlop={10}>
            <Text style={[labelText, { fontSize: 10 }]}>Edit profile</Text>
          </Pressable>
        }
      />
      <PinGrid
        variant="tiles"
        pins={myPins}
        header={
          <View>
            <View style={styles.top}>
              <Pressable
                onPress={editProfile}
                accessibilityLabel="Change profile photo"
              >
                {profile.photoUri ? (
                  <Image
                    source={{ uri: profile.photoUri }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarEmpty]}>
                    <Ionicons
                      name="camera-outline"
                      size={28}
                      color={colors.textMuted}
                    />
                  </View>
                )}
              </Pressable>
              <View style={styles.stats}>
                <Stat value={myPins.length} label="Pins" />
                <Stat value={favoriteIds.length} label="Favorites" />
              </View>
            </View>

            <View style={styles.names}>
              <Text
                style={[
                  styles.business,
                  !profile.businessName && styles.missing,
                ]}
              >
                {profile.businessName || "Your business name"}
              </Text>
              <Text
                style={[styles.realName, !profile.realName && styles.missing]}
              >
                {profile.realName || "Your name"}
              </Text>
            </View>

            <Text style={[labelText, styles.sectionLabel]}>
              Pins you created
            </Text>
          </View>
        }
        empty={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              You haven&apos;t pinned any locations yet.
            </Text>
            <Button
              title="Add a location"
              variant="outline"
              onPress={() => router.push("/add")}
            />
          </View>
        }
      />
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[labelText, styles.statLabel]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  top: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  avatar: { width: 92, height: 92, borderRadius: 46 },
  avatarEmpty: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stats: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
  stat: { alignItems: "center", gap: 2 },
  statValue: { fontFamily: fonts.display, fontSize: 26, color: colors.text },
  statLabel: { fontSize: 9, color: colors.textMuted },
  names: { paddingHorizontal: spacing.md, paddingTop: spacing.md, gap: 2 },
  business: { fontFamily: fonts.display, fontSize: 26, color: colors.text },
  realName: {
    fontFamily: fonts.displayItalic,
    fontSize: 18,
    color: colors.textMuted,
  },
  missing: { color: colors.accentSoft },
  sectionLabel: {
    fontSize: 10,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginBottom: 2,
  },
  empty: {
    alignItems: "center",
    gap: spacing.lg,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontFamily: fonts.displayItalic,
    fontSize: 18,
    color: colors.textMuted,
    textAlign: "center",
  },
});

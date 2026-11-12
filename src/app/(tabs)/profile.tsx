import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/Button";
import { PinGrid } from "@/components/PinGrid";
import { ProfileHeader } from "@/components/ProfileHeader";
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
          <ProfileHeader
            photoUri={profile.photoUri}
            businessName={profile.businessName}
            realName={profile.realName}
            stats={[
              { value: myPins.length, label: "Pins" },
              { value: favoriteIds.length, label: "Favorites" },
            ]}
            sectionLabel="Pins you created"
            onEdit={editProfile}
          />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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

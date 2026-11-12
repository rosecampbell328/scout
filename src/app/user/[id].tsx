import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { PinGrid } from "@/components/PinGrid";
import { ProfileHeader } from "@/components/ProfileHeader";
import { usePins } from "@/data/pins";
import { useProfile } from "@/data/profile";
import { ME } from "@/data/types";
import { colors, fonts, spacing } from "@/theme";

/** A photographer's public profile: their details and the pins they created. */
export default function UserProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pins } = usePins();
  const { profile } = useProfile();

  const theirPins = pins.filter((p) => p.ownerId === id);
  const isMe = id === ME;
  // Until accounts exist, other photographers' names come from their pins.
  const businessName = isMe
    ? profile.businessName
    : (theirPins[0]?.author ?? "Photographer");
  const realName = isMe ? profile.realName : "";

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isMe ? "Your profile" : businessName }} />
      <PinGrid
        variant="tiles"
        pins={theirPins}
        header={
          <ProfileHeader
            photoUri={isMe ? profile.photoUri : null}
            businessName={businessName}
            realName={realName}
            stats={[{ value: theirPins.length, label: "Pins" }]}
            sectionLabel={isMe ? "Pins you created" : "Pins"}
          />
        }
        empty={<Text style={styles.empty}>No pins yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  empty: {
    fontFamily: fonts.displayItalic,
    fontSize: 18,
    color: colors.textMuted,
    textAlign: "center",
    paddingTop: spacing.xl,
  },
});

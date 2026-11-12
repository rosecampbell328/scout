import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts, labelText, spacing } from "@/theme";

import { Avatar } from "./Avatar";

type Props = {
  photoUri: string | null;
  businessName: string;
  realName: string;
  /** Extra lines for other photographers' profiles. */
  city?: string;
  bio?: string;
  stats: { value: number; label: string }[];
  sectionLabel: string;
  /** Your own profile: show prompts for missing details and make the photo tappable. */
  onEdit?: () => void;
};

/** Photo, names and stats shown at the top of a profile (yours or another photographer's). */
export function ProfileHeader({
  photoUri,
  businessName,
  realName,
  city,
  bio,
  stats,
  sectionLabel,
  onEdit,
}: Props) {
  const editable = onEdit !== undefined;
  return (
    <View>
      <View style={styles.top}>
        <Pressable
          onPress={onEdit}
          disabled={!editable}
          accessibilityLabel="Change profile photo"
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatar} />
          ) : editable ? (
            <View style={[styles.avatar, styles.avatarEmpty]}>
              <Ionicons
                name="camera-outline"
                size={28}
                color={colors.textMuted}
              />
            </View>
          ) : (
            <Avatar uri={null} name={businessName} size={92} />
          )}
        </Pressable>
        <View style={styles.stats}>
          {stats.map((s) => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={[labelText, styles.statLabel]}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.names}>
        {businessName || editable ? (
          <Text style={[styles.business, !businessName && styles.missing]}>
            {businessName || "Your business name"}
          </Text>
        ) : null}
        {realName || editable ? (
          <Text style={[styles.realName, !realName && styles.missing]}>
            {realName || "Your name"}
          </Text>
        ) : null}
      </View>

      {city || bio ? (
        <View style={styles.extra}>
          {city ? <Text style={[labelText, styles.city]}>{city}</Text> : null}
          {bio ? <Text style={styles.bio}>{bio}</Text> : null}
        </View>
      ) : null}

      <Text style={[labelText, styles.sectionLabel]}>{sectionLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  extra: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, gap: 6 },
  city: { fontSize: 10, color: colors.textMuted },
  bio: {
    fontFamily: fonts.bodyLight,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
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
});

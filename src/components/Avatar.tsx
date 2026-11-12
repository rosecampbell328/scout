import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { colors, fonts, palette } from "@/theme";

const TINTS = [palette.mist, palette.fog, palette.stone, palette.ice];

/** Round profile photo, or the business name's initials on a soft tint. */
export function Avatar({
  uri,
  name,
  size,
}: {
  uri: string | null;
  name: string;
  size: number;
}) {
  const box = { width: size, height: size, borderRadius: size / 2 };
  if (uri) return <Image source={{ uri }} style={box} />;

  const initials = name
    .replace(/&/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  const tint =
    TINTS[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % TINTS.length];

  return (
    <View style={[box, styles.empty, { backgroundColor: tint }]}>
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  initials: { fontFamily: fonts.display, color: colors.text, letterSpacing: 1 },
});

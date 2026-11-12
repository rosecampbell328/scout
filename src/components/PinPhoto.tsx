import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";

import { colors, fonts } from "@/theme";

/** Location photo, or a soft placeholder when no photo was added. */
export function PinPhoto({
  uri,
  style,
  compact = false,
}: {
  uri: string | null;
  style?: ViewStyle;
  /** Small thumbnail: show an icon instead of the "no photo yet" caption. */
  compact?: boolean;
}) {
  if (uri) {
    return (
      <View style={[styles.fill, style]}>
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
        />
      </View>
    );
  }
  return (
    <View style={[styles.fill, styles.placeholder, style]}>
      {compact ? (
        <Ionicons name="image-outline" size={20} color={colors.textMuted} />
      ) : (
        <Text style={styles.placeholderText}>no photo yet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    width: "100%",
    aspectRatio: 4 / 5,
    backgroundColor: colors.placeholder,
  },
  placeholder: { alignItems: "center", justifyContent: "center" },
  placeholderText: {
    fontFamily: fonts.displayItalic,
    fontSize: 18,
    color: colors.textSubtle,
  },
});

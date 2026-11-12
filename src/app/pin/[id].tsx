import { Stack, useLocalSearchParams } from "expo-router";
import { Linking, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { PinPhoto } from "@/components/PinPhoto";
import { usePins } from "@/data/pins";
import { colors, fonts, labelText, spacing } from "@/theme";

export default function PinDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPin } = usePins();
  const pin = getPin(id);

  if (!pin) {
    return (
      <View style={styles.empty}>
        <Text style={styles.title}>Location not found</Text>
      </View>
    );
  }

  const openDirections = () => {
    const { latitude: lat, longitude: lng } = pin;
    const url =
      Platform.OS === "ios"
        ? `https://maps.apple.com/?daddr=${lat},${lng}`
        : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: "" }} />
      <PinPhoto uri={pin.photoUri} />

      <View style={styles.body}>
        <Text style={[labelText, styles.meta]}>
          {pin.latitude.toFixed(4)}°, {pin.longitude.toFixed(4)}°
        </Text>
        <Text style={styles.title}>{pin.title}</Text>
        <Text style={styles.byline}>scouted by {pin.author}</Text>

        {pin.description ? <Text style={styles.description}>{pin.description}</Text> : null}

        {pin.tags.length > 0 && (
          <View style={styles.tags}>
            {pin.tags.map((t) => (
              <View key={t} style={styles.tag}>
                <Text style={[labelText, { fontSize: 10 }]}>{t}</Text>
              </View>
            ))}
          </View>
        )}

        <Button title="Get directions" variant="outline" onPress={openDirections} style={{ marginTop: spacing.lg }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  body: { padding: spacing.lg, gap: spacing.sm },
  meta: { color: colors.textMuted, fontSize: 10 },
  title: { fontFamily: fonts.display, fontSize: 36, lineHeight: 40, color: colors.text },
  byline: { fontFamily: fonts.displayItalic, fontSize: 17, color: colors.textMuted },
  description: { fontFamily: fonts.bodyLight, fontSize: 15, lineHeight: 24, color: colors.textSubtle, marginTop: spacing.md },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accentSoft,
    backgroundColor: colors.surfaceCool,
  },
});

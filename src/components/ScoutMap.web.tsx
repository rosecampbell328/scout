import { ScrollView, StyleSheet, Text, Pressable, View } from "react-native";

import type { Pin } from "@/data/types";
import { colors, fonts, labelText, spacing } from "@/theme";

export const US_REGION = { latitude: 39.5, longitude: -98.35, latitudeDelta: 32, longitudeDelta: 32 };

type Props = {
  pins: Pin[];
  onPinPress: (pin: Pin) => void;
  onLongPress: (coord: { latitude: number; longitude: number }) => void;
  showsUserLocation?: boolean;
};

/** react-native-maps has no web support; show a simple list in the browser. */
export function ScoutMap({ pins, onPinPress }: Props) {
  return (
    <ScrollView style={StyleSheet.absoluteFill} contentContainerStyle={styles.list}>
      <Text style={[labelText, styles.note]}>The map is available in the iOS and Android app</Text>
      {pins.map((pin) => (
        <Pressable key={pin.id} onPress={() => onPinPress(pin)} style={styles.row}>
          <Text style={styles.title}>{pin.title}</Text>
          <Text style={labelText}>
            {pin.latitude.toFixed(3)}, {pin.longitude.toFixed(3)}
          </Text>
        </Pressable>
      ))}
      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { paddingTop: 140, paddingHorizontal: spacing.lg, maxWidth: 640, width: "100%", alignSelf: "center" },
  note: { color: colors.textMuted, marginBottom: spacing.lg },
  row: { paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border, gap: 4 },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.text },
});

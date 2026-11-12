import type { Ref } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { Pin } from "@/data/types";
import { colors, fonts, labelText, spacing } from "@/theme";

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

/** Minimal stand-in for the native MapView methods the map screen calls. */
export type ScoutMapRef = {
  animateToRegion: (region: Region, duration?: number) => void;
  fitToCoordinates: (
    coords: { latitude: number; longitude: number }[],
    options?: object,
  ) => void;
};

export const US_REGION: Region = {
  latitude: 39.5,
  longitude: -98.35,
  latitudeDelta: 32,
  longitudeDelta: 32,
};

type Props = {
  ref?: Ref<ScoutMapRef>;
  pins: Pin[];
  onPinPress: (pin: Pin) => void;
  onLongPress: (coord: { latitude: number; longitude: number }) => void;
  onMapPress?: () => void;
  showsUserLocation?: boolean;
};

/** react-native-maps has no web support; show a simple list in the browser. */
export function ScoutMap({ pins, onPinPress }: Props) {
  return (
    <ScrollView
      style={StyleSheet.absoluteFill}
      contentContainerStyle={styles.list}
    >
      <Text style={[labelText, styles.note]}>
        The map is available in the iOS and Android app
      </Text>
      {pins.map((pin) => (
        <Pressable
          key={pin.id}
          onPress={() => onPinPress(pin)}
          style={styles.row}
        >
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
  list: {
    paddingTop: 130,
    paddingHorizontal: spacing.lg,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  note: { color: colors.textMuted, marginBottom: spacing.lg },
  row: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    gap: 4,
  },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.text },
});

import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { PinPhoto } from "@/components/PinPhoto";
import { ScoutMap } from "@/components/ScoutMap";
import { usePins } from "@/data/pins";
import type { Pin } from "@/data/types";
import { colors, fonts, labelText, palette, spacing } from "@/theme";

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { pins } = usePins();
  const [selected, setSelected] = useState<Pin | null>(null);
  const [hasLocation, setHasLocation] = useState(false);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then(({ granted }) => setHasLocation(granted))
      .catch(() => {});
  }, []);

  const addAt = (coord?: { latitude: number; longitude: number }) => {
    setSelected(null);
    router.push(
      coord
        ? { pathname: "/add", params: { lat: String(coord.latitude), lng: String(coord.longitude) } }
        : "/add",
    );
  };

  return (
    <View style={styles.container}>
      <ScoutMap pins={pins} onPinPress={setSelected} onLongPress={addAt} showsUserLocation={hasLocation} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]} pointerEvents="box-none">
        <Text style={styles.wordmark}>SCOUT</Text>
        <Text style={styles.tagline}>photoshoot locations, shared by photographers</Text>
      </View>

      {/* Bottom area */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.md }]} pointerEvents="box-none">
        {selected ? (
          <Pressable style={styles.card} onPress={() => router.push(`/pin/${selected.id}`)}>
            <PinPhoto uri={selected.photoUri} style={styles.cardPhoto} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {selected.title}
              </Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {selected.description}
              </Text>
              <Text style={[labelText, styles.cardLink]}>View location →</Text>
            </View>
            <Pressable hitSlop={12} onPress={() => setSelected(null)} style={styles.close}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </Pressable>
        ) : (
          <Text style={[labelText, styles.hint]}>
            {pins.length} locations · long-press the map to drop a pin
          </Text>
        )}
        <Button title="Add a location" onPress={() => addAt()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: spacing.md,
    backgroundColor: "rgba(244, 244, 240, 0.92)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  wordmark: { fontFamily: fonts.display, fontSize: 30, letterSpacing: 10, color: colors.text, paddingLeft: 10 },
  tagline: { fontFamily: fonts.displayItalic, fontSize: 15, color: colors.textMuted, marginTop: 2 },
  bottom: { position: "absolute", left: spacing.md, right: spacing.md, bottom: 0, gap: spacing.sm },
  hint: {
    alignSelf: "center",
    color: colors.textSubtle,
    fontSize: 10,
    backgroundColor: "rgba(250, 250, 246, 0.9)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    overflow: "hidden",
  },
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    shadowColor: palette.ink,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardPhoto: { width: 96, aspectRatio: 4 / 5 },
  cardBody: { flex: 1, padding: spacing.md, justifyContent: "center", gap: 4 },
  cardTitle: { fontFamily: fonts.display, fontSize: 22, color: colors.text, paddingRight: spacing.lg },
  cardDesc: { fontFamily: fonts.bodyLight, fontSize: 13, lineHeight: 18, color: colors.textSubtle },
  cardLink: { fontSize: 10, color: colors.accent, marginTop: 4 },
  close: { position: "absolute", top: 4, right: 10 },
  closeText: { fontSize: 22, color: colors.textMuted },
});

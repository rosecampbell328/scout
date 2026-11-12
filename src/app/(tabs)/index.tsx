import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/Button";
import { PinPhoto } from "@/components/PinPhoto";
import { ScoutMap, type ScoutMapRef } from "@/components/ScoutMap";
import { SearchField } from "@/components/SearchField";
import { pinMatches, usePins } from "@/data/pins";
import type { Pin } from "@/data/types";
import { colors, fonts, labelText, palette, spacing } from "@/theme";

type Coord = { latitude: number; longitude: number };

/** Roughly city-sized zoom. */
const CITY_DELTA = 0.25;
/** Close-up zoom when jumping to a single pin. */
const PIN_DELTA = 0.05;

export default function MapScreen() {
  const mapRef = useRef<ScoutMapRef>(null);
  const { pins } = usePins();
  const [selected, setSelected] = useState<Pin | null>(null);
  const [hasLocation, setHasLocation] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then(({ granted }) => setHasLocation(granted))
      .catch(() => {});
  }, []);

  const trimmed = query.trim();
  const matches = trimmed
    ? pins.filter((p) => pinMatches(p, trimmed)).slice(0, 5)
    : [];
  const showSuggestions = searchFocused && trimmed.length > 0;

  const zoomTo = (coord: Coord, delta: number) =>
    mapRef.current?.animateToRegion(
      { ...coord, latitudeDelta: delta, longitudeDelta: delta },
      700,
    );

  const goToPin = (pin: Pin) => {
    Keyboard.dismiss();
    setSearchFocused(false);
    setSelected(pin);
    zoomTo(pin, PIN_DELTA);
  };

  /** Look the query up as a place (city, address, landmark) and zoom there. */
  const searchPlace = async () => {
    if (!trimmed) return;
    Keyboard.dismiss();
    setSearchFocused(false);
    setSelected(null);
    setSearching(true);
    try {
      // Android's geocoder needs location permission.
      if (!hasLocation) {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        setHasLocation(granted);
      }
      const [place] = await Location.geocodeAsync(trimmed);
      if (place) {
        zoomTo(place, CITY_DELTA);
        return;
      }
    } catch {
      // Fall through to keyword results below.
    } finally {
      setSearching(false);
    }

    // Not a place: show the pins that match the keyword instead.
    const keywordHits = pins.filter((p) => pinMatches(p, trimmed));
    if (keywordHits.length === 1) {
      goToPin(keywordHits[0]);
    } else if (keywordHits.length > 1) {
      mapRef.current?.fitToCoordinates(keywordHits, {
        edgePadding: { top: 160, right: 60, bottom: 160, left: 60 },
        animated: true,
      });
    } else {
      Alert.alert(
        "No results",
        `We couldn't find “${trimmed}”. Try a city name like “Austin, TX”.`,
      );
    }
  };

  const addAt = (coord?: Coord) => {
    setSelected(null);
    router.push(
      coord
        ? {
            pathname: "/add",
            params: {
              lat: String(coord.latitude),
              lng: String(coord.longitude),
            },
          }
        : "/add",
    );
  };

  return (
    <View style={styles.container}>
      <ScoutMap
        ref={mapRef}
        pins={pins}
        onPinPress={setSelected}
        onLongPress={addAt}
        onMapPress={() => {
          setSelected(null);
          setSearchFocused(false);
          Keyboard.dismiss();
        }}
        showsUserLocation={hasLocation}
      />

      {/* Header: wordmark + search */}
      <View style={styles.headerWrap}>
        <AppHeader>
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder="Search a city or keyword"
            onFocus={() => setSearchFocused(true)}
            onSubmitEditing={searchPlace}
          />
        </AppHeader>

        {showSuggestions && (
          <View style={styles.suggestions}>
            <Pressable style={styles.suggestion} onPress={searchPlace}>
              <Ionicons
                name="navigate-outline"
                size={16}
                color={colors.textMuted}
              />
              <Text style={styles.suggestionText} numberOfLines={1}>
                Go to “{trimmed}”
              </Text>
            </Pressable>
            {matches.map((pin) => (
              <Pressable
                key={pin.id}
                style={styles.suggestion}
                onPress={() => goToPin(pin)}
              >
                <Ionicons name="location" size={16} color={colors.pin} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.suggestionText} numberOfLines={1}>
                    {pin.title}
                  </Text>
                  {pin.tags.length > 0 && (
                    <Text
                      style={[labelText, styles.suggestionMeta]}
                      numberOfLines={1}
                    >
                      {pin.tags.join(" · ")}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {searching && (
        <View style={styles.searching}>
          <ActivityIndicator color={colors.accent} />
        </View>
      )}

      {/* Bottom area */}
      <View style={styles.bottom} pointerEvents="box-none">
        {selected ? (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/pin/${selected.id}`)}
          >
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
            <Pressable
              hitSlop={12}
              onPress={() => setSelected(null)}
              style={styles.close}
            >
              <Ionicons name="close" size={18} color={colors.textMuted} />
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
  headerWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  suggestions: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  suggestionText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.text,
    flexShrink: 1,
  },
  suggestionMeta: { fontSize: 9, color: colors.textMuted, marginTop: 2 },
  searching: { position: "absolute", top: "50%", alignSelf: "center" },
  bottom: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    gap: spacing.sm,
  },
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
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.text,
    paddingRight: spacing.lg,
  },
  cardDesc: {
    fontFamily: fonts.bodyLight,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSubtle,
  },
  cardLink: { fontSize: 10, color: colors.accent, marginTop: 4 },
  close: { position: "absolute", top: 8, right: 8 },
});

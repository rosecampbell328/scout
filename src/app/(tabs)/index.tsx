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
import {
  SuggestionList,
  type SuggestionRow,
} from "@/components/SuggestionList";
import { pinMatches, usePins } from "@/data/pins";
import type { Pin } from "@/data/types";
import { usePlaceSuggestions, type PlaceSuggestion } from "@/lib/places";
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
  const { suggestions: cities, loading: citiesLoading } = usePlaceSuggestions(
    query,
    "city",
    searchFocused,
  );

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

  const goToCity = (city: PlaceSuggestion) => {
    Keyboard.dismiss();
    setSearchFocused(false);
    setSelected(null);
    setQuery(city.subtitle ? `${city.title}, ${city.subtitle}` : city.title);
    const b = city.bounds;
    if (b) {
      const latitudeDelta = Math.max((b.maxLat - b.minLat) * 1.2, PIN_DELTA);
      const longitudeDelta = Math.max((b.maxLon - b.minLon) * 1.2, PIN_DELTA);
      mapRef.current?.animateToRegion(
        {
          latitude: (b.minLat + b.maxLat) / 2,
          longitude: (b.minLon + b.maxLon) / 2,
          latitudeDelta,
          longitudeDelta,
        },
        700,
      );
    } else {
      zoomTo(city, CITY_DELTA);
    }
  };

  /** Search button: use the top city suggestion, else ask the phone's geocoder. */
  const searchPlace = async () => {
    if (!trimmed) return;
    if (cities.length > 0) {
      goToCity(cities[0]);
      return;
    }
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
          <SuggestionList
            style={styles.suggestions}
            loading={citiesLoading && matches.length === 0}
            headings={{
              ...(cities[0] && { [`city-${cities[0].id}`]: "Places" }),
              ...(matches[0] && { [`pin-${matches[0].id}`]: "Scout pins" }),
            }}
            rows={[
              ...cities.map<SuggestionRow>((c) => ({
                key: `city-${c.id}`,
                title: c.title,
                subtitle: c.subtitle,
                icon: "navigate-outline",
                onPress: () => goToCity(c),
              })),
              ...matches.map<SuggestionRow>((pin) => ({
                key: `pin-${pin.id}`,
                title: pin.title,
                subtitle: pin.address || pin.tags.join(" · "),
                icon: "location",
                iconColor: colors.pin,
                onPress: () => goToPin(pin),
              })),
            ]}
          />
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
  suggestions: { marginHorizontal: spacing.md, marginBottom: spacing.sm },
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

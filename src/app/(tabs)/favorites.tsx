import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { PinGrid } from "@/components/PinGrid";
import { SearchField } from "@/components/SearchField";
import { pinMatches, usePins } from "@/data/pins";
import type { Pin } from "@/data/types";
import { colors, fonts, spacing } from "@/theme";

export default function FavoritesScreen() {
  const { favoriteIds, getPin } = usePins();
  const [query, setQuery] = useState("");

  const favorites = favoriteIds
    .map(getPin)
    .filter((p): p is Pin => p !== undefined);
  const results = favorites.filter((p) => pinMatches(p, query));

  return (
    <View style={styles.container}>
      <AppHeader
        right={
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder="Search favorites"
            style={styles.search}
          />
        }
      />
      <PinGrid
        pins={results}
        header={
          <View style={styles.titleRow}>
            <Text style={styles.title}>Favorites</Text>
            <Text style={styles.count}>
              {query
                ? `${results.length} of ${favorites.length}`
                : favorites.length}
            </Text>
          </View>
        }
        empty={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={32} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              {favorites.length === 0
                ? "Tap the heart on any location to save it here."
                : `No favorites match “${query.trim()}”.`}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  search: { width: "100%", maxWidth: 220 },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  title: { fontFamily: fonts.display, fontSize: 34, color: colors.text },
  count: {
    fontFamily: fonts.displayItalic,
    fontSize: 18,
    color: colors.textMuted,
  },
  empty: {
    alignItems: "center",
    gap: spacing.md,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontFamily: fonts.displayItalic,
    fontSize: 18,
    color: colors.textMuted,
    textAlign: "center",
  },
});

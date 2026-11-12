import { router } from "expo-router";
import type { ReactElement } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import type { Pin } from "@/data/types";
import { colors, fonts, labelText, spacing } from "@/theme";

import { PinPhoto } from "./PinPhoto";

type Props = {
  pins: Pin[];
  /** "cards": 2 columns with titles. "tiles": 3 columns of photos only (Instagram-style). */
  variant?: "cards" | "tiles";
  header?: ReactElement;
  empty?: ReactElement;
};

export function PinGrid({ pins, variant = "cards", header, empty }: Props) {
  const tiles = variant === "tiles";
  const columns = tiles ? 3 : 2;
  return (
    <FlatList
      key={variant}
      data={pins}
      keyExtractor={(p) => p.id}
      numColumns={columns}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      contentContainerStyle={tiles ? styles.tilesContent : styles.cardsContent}
      columnWrapperStyle={{ gap: tiles ? 2 : spacing.md }}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [
            { flex: 1 / columns, opacity: pressed ? 0.8 : 1 },
            !tiles && styles.card,
          ]}
          onPress={() => router.push(`/pin/${item.id}`)}
        >
          <PinPhoto
            uri={item.photoUri}
            style={tiles ? styles.tilePhoto : undefined}
          />
          {!tiles && (
            <View style={styles.cardBody}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[labelText, styles.meta]} numberOfLines={1}>
                {item.tags[0] ?? item.author}
              </Text>
            </View>
          )}
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  cardsContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  tilesContent: { paddingBottom: spacing.xl, gap: 2 },
  card: {},
  tilePhoto: { aspectRatio: 1 },
  cardBody: { paddingTop: spacing.sm, gap: 2 },
  title: { fontFamily: fonts.display, fontSize: 19, color: colors.text },
  meta: { fontSize: 9, color: colors.textMuted },
});

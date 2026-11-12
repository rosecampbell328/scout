import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { Avatar } from "@/components/Avatar";
import { PinPhoto } from "@/components/PinPhoto";
import { SearchField } from "@/components/SearchField";
import { people, personMatches, type Person } from "@/data/people";
import { pinMatches, usePins } from "@/data/pins";
import type { Pin } from "@/data/types";
import { colors, fonts, labelText, spacing } from "@/theme";

type Filter = "all" | "locations" | "people";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "locations", label: "Locations" },
  { key: "people", label: "Photographers" },
];

export default function SearchScreen() {
  const { pins } = usePins();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const trimmed = query.trim();
  const showPeople = filter !== "locations";
  const showPins = filter !== "people";
  const peopleHits = showPeople
    ? people.filter((p) => personMatches(p, trimmed))
    : [];
  const pinHits = showPins ? pins.filter((p) => pinMatches(p, trimmed)) : [];
  const pinCount = (id: string) => pins.filter((p) => p.ownerId === id).length;

  return (
    <View style={styles.container}>
      <AppHeader>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Search locations or photographers"
        />
        <View style={styles.filters}>
          {FILTERS.map((f) => (
            <Pressable key={f.key} onPress={() => setFilter(f.key)} hitSlop={6}>
              <Text
                style={[
                  labelText,
                  styles.filter,
                  filter === f.key && styles.filterOn,
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </AppHeader>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {peopleHits.length > 0 && (
          <Section
            title={trimmed ? "Photographers" : "Suggested profiles"}
          >
            {peopleHits.map((person) => (
              <PersonRow
                key={person.id}
                person={person}
                pinCount={pinCount(person.id)}
              />
            ))}
          </Section>
        )}

        {pinHits.length > 0 && (
          <Section title={trimmed ? "Locations" : "Suggested locations"}>
            {pinHits.map((pin) => (
              <PinRow key={pin.id} pin={pin} />
            ))}
          </Section>
        )}

        {peopleHits.length === 0 && pinHits.length === 0 && (
          <Text style={styles.empty}>Nothing matches “{trimmed}”.</Text>
        )}
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={[labelText, styles.sectionTitle]}>{title}</Text>
      {children}
    </View>
  );
}

function PersonRow({ person, pinCount }: { person: Person; pinCount: number }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={() => router.push(`/user/${person.id}`)}
    >
      <Avatar uri={person.photoUri} name={person.businessName} size={48} />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {person.businessName}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {person.realName} · {person.city}
        </Text>
      </View>
      <Text style={[labelText, styles.rowMeta]}>
        {pinCount} {pinCount === 1 ? "pin" : "pins"}
      </Text>
    </Pressable>
  );
}

function PinRow({ pin }: { pin: Pin }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={() => router.push(`/pin/${pin.id}`)}
    >
      <PinPhoto uri={pin.photoUri} style={styles.thumb} compact />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {pin.title}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {pin.address || pin.author}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filters: { flexDirection: "row", gap: spacing.lg, paddingTop: spacing.xs },
  filter: { fontSize: 10, color: colors.textMuted, paddingBottom: 6 },
  filterOn: {
    color: colors.text,
    borderBottomWidth: 1,
    borderColor: colors.text,
  },
  content: { paddingBottom: spacing.xxl },
  section: { paddingTop: spacing.lg },
  sectionTitle: {
    fontSize: 10,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  pressed: { backgroundColor: colors.divider },
  thumb: { width: 48, aspectRatio: 1 },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontFamily: fonts.display, fontSize: 19, color: colors.text },
  rowSub: {
    fontFamily: fonts.bodyLight,
    fontSize: 13,
    color: colors.textMuted,
  },
  rowMeta: { fontSize: 9, color: colors.textMuted },
  empty: {
    fontFamily: fonts.displayItalic,
    fontSize: 18,
    color: colors.textMuted,
    textAlign: "center",
    paddingTop: spacing.xxl,
  },
});

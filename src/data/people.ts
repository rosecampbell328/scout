/**
 * Example photographers so search and profiles have something to show.
 * Replace with real accounts once there's a backend.
 */
export type Person = {
  id: string;
  businessName: string;
  realName: string;
  /** Home base, e.g. "Seattle, WA". */
  city: string;
  bio: string;
  photoUri: string | null;
};

export const people: Person[] = [
  {
    id: "willow-pine",
    businessName: "Willow & Pine Photography",
    realName: "Maya Collins",
    city: "Seattle, WA",
    bio: "Moody Pacific Northwest elopements and couples.",
    photoUri: null,
  },
  {
    id: "golden-hour-co",
    businessName: "Golden Hour Co.",
    realName: "Jordan Reyes",
    city: "Austin, TX",
    bio: "Warm, candid portraits. Always chasing the last light.",
    photoUri: null,
  },
  {
    id: "northlight-studio",
    businessName: "Northlight Studio",
    realName: "Priya Shah",
    city: "Brooklyn, NY",
    bio: "City engagements and editorial headshots.",
    photoUri: null,
  },
  {
    id: "saltwater-stories",
    businessName: "Saltwater Stories",
    realName: "Ella Brooks",
    city: "San Francisco, CA",
    bio: "Coastal sessions up and down California.",
    photoUri: null,
  },
  {
    id: "desert-bloom",
    businessName: "Desert Bloom Photo",
    realName: "Luis Ortega",
    city: "Phoenix, AZ",
    bio: "Adventure sessions across the Southwest.",
    photoUri: null,
  },
  {
    id: "magnolia-film",
    businessName: "Magnolia Film Co.",
    realName: "Sam Whitaker",
    city: "Savannah, GA",
    bio: "Southern charm on 35mm and digital.",
    photoUri: null,
  },
];

export const getPerson = (id: string) => people.find((p) => p.id === id);

/** Case-insensitive match against a photographer's names and city. */
export function personMatches(person: Person, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [person.businessName, person.realName, person.city].some((s) =>
    s.toLowerCase().includes(q),
  );
}

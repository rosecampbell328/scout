import * as Location from "expo-location";
import { useEffect, useState } from "react";

/**
 * Place + address lookup for search-as-you-type.
 *
 * Uses Photon (https://photon.komoot.io), a free OpenStreetMap-based
 * geocoder built for autocomplete, with no API key. For heavy production
 * traffic, swap `fetchPhoton` for a keyed provider (Google Places, Mapbox);
 * the rest of the app only uses the functions exported here.
 */

export type PlaceKind = "city" | "address";

export type PlaceSuggestion = {
  id: string;
  /** First line, e.g. "Austin" or "2516 NW 2nd Ave". */
  title: string;
  /** Second line, e.g. "Texas" or "Miami, FL 33127". */
  subtitle: string;
  /** Full one-line address to store on a pin. */
  address: string;
  latitude: number;
  longitude: number;
  /** Bounding box when the place is an area (city, town…). */
  bounds?: { minLat: number; maxLat: number; minLon: number; maxLon: number };
};

type PhotonFeature = {
  geometry: { coordinates: [number, number] };
  properties: {
    osm_id?: number;
    osm_type?: string;
    osm_value?: string;
    type?: string;
    name?: string;
    housenumber?: string;
    street?: string;
    city?: string;
    district?: string;
    county?: string;
    state?: string;
    postcode?: string;
    countrycode?: string;
    /** [minLon, maxLat, maxLon, minLat] */
    extent?: [number, number, number, number];
  };
};

const PHOTON_URL = "https://photon.komoot.io/api/";
/** Covers the 50 states (incl. Alaska & Hawaii); results are also filtered to the US. */
const US_BBOX = "-179.2,18.9,-66.9,71.4";
const CITY_VALUES = new Set([
  "city",
  "town",
  "village",
  "hamlet",
  "suburb",
  "borough",
  "locality",
]);

const STATE_ABBR: Record<string, string> = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  "District of Columbia": "DC",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

const abbr = (state?: string | null) =>
  state ? (STATE_ABBR[state] ?? state) : "";
const join = (parts: (string | null | undefined)[], sep: string) =>
  parts.filter((p) => p && p.trim()).join(sep);

async function fetchPhoton(
  query: string,
  kind: PlaceKind,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({
    q: query,
    limit: "15",
    lang: "en",
    bbox: US_BBOX,
  });
  if (kind === "city") params.append("osm_tag", "place");
  const res = await fetch(`${PHOTON_URL}?${params}`, { signal });
  if (!res.ok) throw new Error(`Place search failed (${res.status})`);
  const json = (await res.json()) as { features?: PhotonFeature[] };
  return json.features ?? [];
}

function toSuggestion(
  f: PhotonFeature,
  kind: PlaceKind,
): PlaceSuggestion | null {
  const p = f.properties;
  if (p.countrycode && p.countrycode.toUpperCase() !== "US") return null;
  const [longitude, latitude] = f.geometry.coordinates;
  const stateZip = join([abbr(p.state), p.postcode], " ");
  let title: string;
  let subtitle: string;

  if (kind === "city") {
    if (!p.name || (p.osm_value && !CITY_VALUES.has(p.osm_value))) return null;
    title = p.name;
    subtitle = join([p.osm_value === "suburb" ? p.city : null, p.state], ", ");
  } else {
    const street = join([p.housenumber, p.street], " ");
    // A named place (park, business…) leads with its name; a plain address with the street.
    const named = p.name && p.name !== p.street ? p.name : null;
    const town = p.city ?? p.district ?? p.county;
    title = named || street;
    subtitle = join([named ? street : null, town, stateZip], ", ");
    if (!title) {
      title = p.city ?? p.state ?? "";
      subtitle = join([p.city ? abbr(p.state) : null], ", ");
    }
    if (!title) return null;
  }

  const e = p.extent;
  return {
    id: `${p.osm_type ?? ""}${p.osm_id ?? `${latitude},${longitude}`}`,
    title,
    subtitle,
    address: join([title, subtitle], ", "),
    latitude,
    longitude,
    bounds: e
      ? { minLon: e[0], maxLat: e[1], maxLon: e[2], minLat: e[3] }
      : undefined,
  };
}

export async function searchPlaces(
  query: string,
  kind: PlaceKind,
  signal?: AbortSignal,
) {
  const features = await fetchPhoton(query, kind, signal);
  const seen = new Set<string>();
  const out: PlaceSuggestion[] = [];
  for (const f of features) {
    const s = toSuggestion(f, kind);
    if (!s || seen.has(s.address)) continue;
    seen.add(s.address);
    out.push(s);
    if (out.length === 6) break;
  }
  return out;
}

const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;

/** Debounced place suggestions for whatever the user is typing. */
export function usePlaceSuggestions(
  query: string,
  kind: PlaceKind,
  enabled = true,
) {
  const trimmed = query.trim();
  const active = enabled && trimmed.length >= MIN_CHARS;
  const [state, setState] = useState<{
    query: string;
    results: PlaceSuggestion[];
  }>({
    query: "",
    results: [],
  });

  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchPlaces(trimmed, kind, controller.signal)
        .then((results) => setState({ query: trimmed, results }))
        .catch(() => {
          if (!controller.signal.aborted)
            setState({ query: trimmed, results: [] });
        });
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, kind, active]);

  return {
    suggestions: active ? state.results : [],
    loading: active && state.query !== trimmed,
  };
}

/** Turn coordinates into a one-line street address using the phone's geocoder. */
export async function addressFromCoords(coord: {
  latitude: number;
  longitude: number;
}) {
  try {
    const [a] = await Location.reverseGeocodeAsync(coord);
    if (!a) return "";
    const street = join([a.streetNumber, a.street], " ") || a.name;
    return join(
      [
        street,
        a.city ?? a.subregion,
        join([abbr(a.region), a.postalCode], " "),
      ],
      ", ",
    );
  } catch {
    return "";
  }
}

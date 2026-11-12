# Scout

A location-scouting app that helps photographers across the US find and share photoshoot spots.

- **Bottom bar** — Map · Favorites · Profile. The app opens on the map.
- **Map** — red pins dropped by photographers. Search a city to zoom there, or a keyword to find matching pins.
- **Add a location** — long-press the map (or tap *Add a location*), add a name, notes, tags and a photo of how it looks.
- **Location detail** — full photo, notes, tags, favorite button and one-tap directions.
- **Favorites** — locations you've hearted, with search.
- **Profile** — your photo, business name, real name and the pins you created.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android). The map uses `react-native-maps`, which is included in Expo Go.

## Project layout

- `src/app/(tabs)/` — tab screens: `index.tsx` (map), `favorites.tsx`, `profile.tsx`
- `src/app/` — `add.tsx` (new pin), `edit-profile.tsx`, `pin/[id].tsx` (detail)
- `src/components/` — `ScoutMap` (with a web fallback list), `AppHeader`, `SearchField`, `PinGrid`, `Button`, `PinPhoto`
- `src/data/` — pin types, seed pins, the `PinsProvider` (pins + favorites) and `ProfileProvider` stores
- `src/theme/` — color palette, fonts and the custom map style

## Next step: sharing pins

Pins, favorites and your profile are currently saved on-device with AsyncStorage. To make them shared between photographers, connect a backend (e.g. Supabase or Firebase) inside `src/data/pins.tsx` — screens only talk to that store.

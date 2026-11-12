# Scout

A location-scouting app that helps photographers across the US find and share photoshoot spots.

- **Map first** — the app opens on a map of pins dropped by photographers.
- **Add a location** — long-press the map (or tap *Add a location*), add a name, notes, tags and a photo of how it looks.
- **Location detail** — full photo, notes, tags and one-tap directions.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android). The map uses `react-native-maps`, which is included in Expo Go.

## Project layout

- `src/app/` — screens (Expo Router): `index.tsx` (map), `add.tsx` (new pin), `pin/[id].tsx` (detail)
- `src/components/` — `ScoutMap` (with a web fallback list), `Button`, `PinPhoto`
- `src/data/` — pin types, seed pins, and the `PinsProvider` store
- `src/theme/` — color palette, fonts and the custom map style

## Next step: sharing pins

Pins are currently saved on-device with AsyncStorage. To make them shared between photographers, connect a backend (e.g. Supabase or Firebase) inside `src/data/pins.tsx` — screens only talk to that store.

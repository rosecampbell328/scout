import type { MapStyleElement } from "react-native-maps";

import { palette } from "./index";

/** Muted, desaturated Google Maps style (used on Android) in the Scout palette. */
export const mapStyle: MapStyleElement[] = [
  { elementType: "geometry", stylers: [{ color: palette.linen }] },
  { elementType: "labels.text.fill", stylers: [{ color: palette.taupe }] },
  { elementType: "labels.text.stroke", stylers: [{ color: palette.ivory }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: palette.stone }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: palette.fog }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: palette.stone }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#D5DBD3" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: palette.ivory }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: palette.mist }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: palette.slate }],
  },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: palette.mist }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: palette.dusk }],
  },
];

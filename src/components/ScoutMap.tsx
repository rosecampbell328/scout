import type { Ref } from "react";
import { Platform, StyleSheet } from "react-native";
import MapView, { Marker, type Region } from "react-native-maps";

import type { Pin } from "@/data/types";
import { mapStyle } from "@/theme/mapStyle";

export type ScoutMapRef = MapView;

const PIN_IMAGE = require("@/assets/images/pin.png");
/** Height of pin.png in points. */
const PIN_HEIGHT = 38;

/** Roughly centered on the contiguous United States. */
export const US_REGION: Region = {
  latitude: 39.5,
  longitude: -98.35,
  latitudeDelta: 32,
  longitudeDelta: 32,
};

type Props = {
  ref?: Ref<ScoutMapRef>;
  pins: Pin[];
  onPinPress: (pin: Pin) => void;
  onLongPress: (coord: { latitude: number; longitude: number }) => void;
  onMapPress?: () => void;
  showsUserLocation?: boolean;
};

export function ScoutMap({
  ref,
  pins,
  onPinPress,
  onLongPress,
  onMapPress,
  showsUserLocation,
}: Props) {
  return (
    <MapView
      ref={ref}
      style={StyleSheet.absoluteFill}
      initialRegion={US_REGION}
      mapType={Platform.OS === "ios" ? "mutedStandard" : "standard"}
      customMapStyle={mapStyle}
      userInterfaceStyle="light"
      showsUserLocation={showsUserLocation}
      showsPointsOfInterests={false}
      showsCompass={false}
      toolbarEnabled={false}
      onPress={onMapPress}
      onLongPress={(e) => onLongPress(e.nativeEvent.coordinate)}
    >
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
          image={PIN_IMAGE}
          // Put the pin's tip (bottom center) on the coordinate.
          anchor={{ x: 0.5, y: 1 }}
          centerOffset={{ x: 0, y: -PIN_HEIGHT / 2 }}
          stopPropagation
          onPress={() => onPinPress(pin)}
        />
      ))}
    </MapView>
  );
}

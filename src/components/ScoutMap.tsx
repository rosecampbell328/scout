import { useState, type Ref } from "react";
import { Image, Platform, StyleSheet } from "react-native";
import MapView, { Marker, type Region } from "react-native-maps";

import type { Pin } from "@/data/types";
import { mapStyle } from "@/theme/mapStyle";

export type ScoutMapRef = MapView;

const PIN_IMAGE = require("@/assets/images/pin.png");
/** Size of pin.png in points. */
const PIN_WIDTH = 26;
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
        <PinMarker key={pin.id} pin={pin} onPress={() => onPinPress(pin)} />
      ))}
    </MapView>
  );
}

/**
 * Red teardrop pin, drawn as a child view rather than the Marker `image`
 * prop: on iOS that prop loads through the legacy bridge, which doesn't
 * exist under the New Architecture, so the pin never appears.
 */
function PinMarker({ pin, onPress }: { pin: Pin; onPress: () => void }) {
  // Android snapshots custom marker views; keep tracking until the image
  // has loaded so the pin isn't captured blank, then stop for performance.
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  return (
    <Marker
      coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
      // Put the pin's tip (bottom center) on the coordinate.
      anchor={{ x: 0.5, y: 1 }}
      centerOffset={{ x: 0, y: -PIN_HEIGHT / 2 }}
      tracksViewChanges={tracksViewChanges}
      stopPropagation
      onPress={onPress}
    >
      <Image
        source={PIN_IMAGE}
        style={styles.pin}
        onLoad={() => setTracksViewChanges(false)}
      />
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: { width: PIN_WIDTH, height: PIN_HEIGHT },
});

import { useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapView, { Marker, type Region } from "react-native-maps";

import type { Pin } from "@/data/types";
import { colors, palette } from "@/theme";
import { mapStyle } from "@/theme/mapStyle";

/** Roughly centered on the contiguous United States. */
export const US_REGION: Region = {
  latitude: 39.5,
  longitude: -98.35,
  latitudeDelta: 32,
  longitudeDelta: 32,
};

type Props = {
  pins: Pin[];
  onPinPress: (pin: Pin) => void;
  onLongPress: (coord: { latitude: number; longitude: number }) => void;
  showsUserLocation?: boolean;
};

export function ScoutMap({ pins, onPinPress, onLongPress, showsUserLocation }: Props) {
  const mapRef = useRef<MapView>(null);

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      initialRegion={US_REGION}
      mapType={Platform.OS === "ios" ? "mutedStandard" : "standard"}
      customMapStyle={mapStyle}
      userInterfaceStyle="light"
      showsUserLocation={showsUserLocation}
      showsPointsOfInterests={false}
      showsCompass={false}
      toolbarEnabled={false}
      onLongPress={(e) => onLongPress(e.nativeEvent.coordinate)}
    >
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
          onPress={() => onPinPress(pin)}
          tracksViewChanges={false}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.pinOuter}>
            <View style={styles.pinInner} />
          </View>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  pinOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: palette.ivory,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.ink,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  pinInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accent },
});

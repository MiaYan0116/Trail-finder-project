import React, { useState } from "react";
import { Button } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function Map({ navigation, route }) {
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const locationList = route.params;
    
  function confirmLocationHandler() {
    navigation.navigate("Wishlist", { selectedCoord: selectedLocation });
  }

  console.log("map: ", locationList);
  return (
    <>
      <MapView
        initialRegion={{
          latitude: 49.2827,
          longitude: -123.1207,
          latitudeDelta: 4,
          longitudeDelta: 6,
        }}
        style={{ flex: 1 }}
        onPress={(e) => {
          setSelectedLocation({
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          });
        }}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
        {locationList.map((location, index) => (
            <Marker
                key={index} // Make sure to include a unique key for each Marker
                coordinate={{
                latitude: location.lat,
                longitude: location.lng,
                }}
            />
        ))}
      </MapView>
      <Button
        disabled={!selectedLocation}
        title="Confirm Selected Location"
        onPress={confirmLocationHandler}
      />
    </>
  );
}
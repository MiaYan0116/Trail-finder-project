// The LocationManager is responsible for managing and displaying location-related information.

import {  Alert, View, Button, StyleSheet, Image, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { mapAPIKey } from "@env";
import { useNavigation, useRoute } from "@react-navigation/native";
import SingleButton from './SingleButton';


const windowWidth = Dimensions.get("window").width;

export default function LocationManager({ locationList }) {
  const navigation = useNavigation();
  const route = useRoute();
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (route.params) {
      // I have come from interactive map
      setLocation(route.params.selectedCoord);
    }
  }, [route]);

  const verifyPermission = async () => {
    if (status.granted) {
      return true;
    }
    const response = await requestPermission();
    return response.granted;
  };
  async function locateMeHandler() {
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        Alert.alert("You need to give access to the location");
      }
      const locationObject = await Location.getCurrentPositionAsync();
      setLocation({
        latitude: locationObject.coords.latitude,
        longitude: locationObject.coords.longitude,
      });
    } catch (err) {
      console.log("locate user ", err);
    }
  }
  const chooseLocationHandler = () => {
    navigation.navigate("Map", locationList);
  };
  return (
    <View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <SingleButton text={'Where am I?'} handlefunc={locateMeHandler} iconName={"location-arrow"}/>
            <SingleButton text={"Trails Map"} handlefunc={chooseLocationHandler} iconName={"map"}/>
        </View>
        {location && (
            <Image
            source={{
                uri: `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:L%7C${location.latitude},${location.longitude}&key=${mapAPIKey}`,
            }}
            style={styles.image}
            />
        )}
    </View>
  );
}
const styles = StyleSheet.create({
  image: {
    width: windowWidth,
    height: 100,
  },
});
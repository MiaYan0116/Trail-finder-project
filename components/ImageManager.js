import { Pressable, View, Image, Button, StyleSheet } from "react-native";
import React, { useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { container, themeBackgroundColor } from '../styles'
import * as ImagePicker from "expo-image-picker";


export default function ImageManager({ setPassImageUri }) {
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [imageUri, setImageUri] = useState("");
  const verifyPermission = async () => {
    if (status.granted) {
      return true;
    }
    const response = await requestPermission();
    return response.granted;
  };
  const takeImageHandler = async () => {
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        Alert.alert("You need to give access to the camera");
      }
      //   if hasPermission, launch the camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
      });
      console.log("result", result);
      setImageUri(result.assets[0].uri);
      setPassImageUri(result.assets[0].uri);
    } catch (err) {
      console.log("take image error ", err);
    }
  };

  return (
    <View>
      <Pressable onPress={takeImageHandler}>
        {({ pressed }) => (
          <Icon
            name="camera"
            size={24}
            color={pressed ? 'red' : themeBackgroundColor}
            style={styles.cameraIcon}
          />
        )}
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  cameraIcon: {
    position: 'absolute',
    bottom: 2,
    right: 30,
    backgroundColor: 'transparent', // Make the background transparent
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
});



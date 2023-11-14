import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
const ProfileScreen = ({ navigation }) => {
  const loginHandler = () => {
		navigation.navigate('Login');
	}

  return (
    <View>
      <Text>Profile</Text>
      <Button title="Login" onPress={loginHandler}/>
    </View>
  )
}

export default ProfileScreen
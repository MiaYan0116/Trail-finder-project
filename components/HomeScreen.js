import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
const HomeScreen = ({ navigation }) => {
  const detailsHandler = () => {
		navigation.navigate('Details');
	}

  return (
    <View>
      <Text>Home</Text>
      <Button title="Details" onPress={detailsHandler}/>
    </View>
  )
}

export default HomeScreen
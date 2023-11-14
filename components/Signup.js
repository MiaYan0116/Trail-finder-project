import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { iconSize, themeBackgroundColor, themeTintColor, buttonActiveColor, buttonInactiveColor } from '../styles';

const Signup = ({ navigation }) => {
	
	const loginHandler = () => {
		navigation.replace("Login")
	}

  return (
    <View>
			<Text>Signup</Text>
			<Button title="Login" onPress={loginHandler}/>
		</View>
  )
}

export default Signup
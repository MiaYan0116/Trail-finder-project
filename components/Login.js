import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { iconSize, themeBackgroundColor, themeTintColor, buttonActiveColor, buttonInactiveColor } from '../styles';

const Login = ({ navigation }) => {
	
	const signupHandler = () => {
		navigation.replace("Signup")
	}

  return (
    <View>
			<Text>Login</Text>
			<Button title="Signup" onPress={signupHandler}/>
		</View>
  )
}

export default Login
import React, { useState } from 'react'
import { Pressable, TextInput, ImageBackground, StyleSheet, View, Text, Button } from 'react-native'
import { iconSize, themeBackgroundColor, themeTintColor, buttonActiveColor, buttonInactiveColor, buttonFontSize, backGroundImage, buttonborderRadius } from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const emailChangeHandle = (email) => {
		setEmail(email);
	}

	const passwordChangeHandle = (password) => {
		setPassword(password);
	}

	const loginHandler = () => {
		if(email != '' && password != ''){
			const user = {
				email: email,
				password: password
			}
			console.log("login", user);
		}
	}

	const signupHandler = () => {
		navigation.replace("Signup")
	}

  return (
    <ImageBackground
      source={require('../assets/login_image.jpeg')}
      style={backGroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Trail Finder</Text>
					<View style={styles.inputContainer}>
						<Icon name="envelope" size={20} color="#777" style={{ marginRight: 10, color: '#CD853F' }} />
						<TextInput
							placeholder="Email Address"
							placeholderTextColor={themeTintColor}
							style={styles.input}
							onChangeText={emailChangeHandle}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Icon name="key" size={20} color="#777" style={{ marginRight: 10, color: '#CD853F' }} />
						<TextInput
							placeholder="Password"
							placeholderTextColor={themeTintColor}
							style={styles.input}
							onChangeText={passwordChangeHandle}
						/>
				</View>
        <View style={styles.buttonContainer}>
					<Pressable
						style={({ pressed }) => [
							{ backgroundColor: pressed ? buttonInactiveColor : themeBackgroundColor },
							styles.button,
						]}
						onPress={loginHandler}
					>
						{({ pressed }) => (
							<Text 
								style={[styles.buttonText, 
								{ color: pressed ? buttonInactiveColor : themeTintColor }]}
							>
								Login
							</Text>
						)}
					</Pressable>
					<Pressable
						style={({ pressed }) => [
							{ color: pressed ? buttonInactiveColor : themeBackgroundColor },
							styles.buttonText,
						]}
						onPress={signupHandler}
					>
						{({ pressed }) => (
							<Text 
								style={[styles.buttonText, 
								{ color: pressed ? buttonInactiveColor : themeTintColor }]}
							>
								New User? Create an account
							</Text>
						)}
					</Pressable>
        </View>
        
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
	container: {
    backgroundColor: 'rgba(255,255,255,0)', 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    color: themeTintColor,
    fontWeight: 'bold'
  },
  inputContainer: {
    flexDirection: 'row', 
		alignItems: 'center', 
		borderWidth: 1, 
		borderColor: 'gray', 
		borderRadius: 5, 
		padding: 5,
		marginTop: 20,
		marginHorizontal: 25
  },
  input: {
		height: 20, 
    flex: 1, 
    fontSize: 18,
    textAlign: 'left',
    marginVertical: 5,
    padding: 0,
		color: themeTintColor
  },
  buttonContainer:{
		marginLeft: 40,
    marginTop: 40
  },
	button: {
		backgroundColor: 'rgba(255,255,255,0)', 
		margin: 20,
		padding: 10,
		width: 200,
		borderWidth: 2, // Add border width
    borderColor: themeTintColor, // Add border color
    borderRadius: buttonborderRadius,
	},
	buttonText: {
		color: themeTintColor,
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
	}
})

export default Login
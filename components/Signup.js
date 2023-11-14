import React, { useState } from 'react'
import { Alert, Pressable, TextInput, ImageBackground, StyleSheet, View, Text, Button } from 'react-native'
import { iconSize, themeBackgroundColor, themeTintColor, buttonActiveColor, buttonInactiveColor, buttonFontSize, backGroundImage, buttonborderRadius } from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseSetup';

const Signup = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const emailChangeHandle = (email) => {
		setEmail(email);
	}

	const passwordChangeHandle = (password) => {
		setPassword(password);
	}

	const confirmPasswordChangeHandle = (confirmPassword) => {
		setConfirmPassword(confirmPassword);
	}

	const signupHandler = async () => {
		if(email == '' || password == '' || confirmPassword == ''){
			Alert.alert("All fields should not be empty")
			return;
		}
		if(password != confirmPassword){
			Alert.alert("The password should match the confirm password")
			return;
		}
		try {
			const userCred = await createUserWithEmailAndPassword(auth, email, password);
			console.log(userCred);
		} catch (error) {
			console.log("signup err", error.code)
			if(error.code === 'auth/invalid-email'){
				Alert.alert("email is invalid")
			}else if(error.code === 'auth/weak-password'){
				Alert.alert("Password should be at least 6 characters")
			}
		}
	}

	const loginHandler = () => {
		navigation.replace("Login")
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
							secureTextEntry={true}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Icon name="key" size={20} color="#777" style={{ marginRight: 10, color: '#CD853F' }} />
						<TextInput
							placeholder="Confirm Password"
							placeholderTextColor={themeTintColor}
							style={styles.input}
							onChangeText={confirmPasswordChangeHandle}
							secureTextEntry={true}
						/>
					</View>
        <View style={styles.buttonContainer}>
					<Pressable
						style={({ pressed }) => [
							{ backgroundColor: pressed ? buttonInactiveColor : themeBackgroundColor },
							styles.button,
						]}
						onPress={signupHandler}
					>
						{({ pressed }) => (
							<Text 
								style={[styles.buttonText, 
								{ color: pressed ? buttonInactiveColor : themeTintColor }]}
							>
								Signup
							</Text>
						)}
					</Pressable>
					<Pressable
						style={({ pressed }) => [
							{ color: pressed ? buttonInactiveColor : themeBackgroundColor },
							styles.buttonText,
						]}
						onPress={loginHandler}
					>
						{({ pressed }) => (
							<Text 
								style={[styles.buttonText, 
								{ color: pressed ? buttonInactiveColor : themeTintColor }]}
							>
								Already have account? Login
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

export default Signup
// This defines a ProfileStack component with multiple screens which serves as a container for the navigation stack.

import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { iconSize, themeBackgroundColor, themeTintColor, buttonActiveColor, buttonInactiveColor } from '../styles';
import ProfileScreen from './ProfileScreen';
import Login from './Login';
import Signup from './Signup';
import WishlistScreen from './WishlistScreen';
import Map from "./Map";

const Stack = createNativeStackNavigator();
const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: themeBackgroundColor
      },
      headerTintColor: themeTintColor,
    }}>
			<Stack.Screen
				name='ProfileScreen'
				component={ProfileScreen}
				options={() => ({
					headerTitle: 'Profile',
				})}
			/>
			<Stack.Screen
				name='Login'
				component={Login}
				options={() => ({
					headerTitle: 'Login',
				})}
			/>
			<Stack.Screen
				name='Signup'
				component={Signup}
				options={() => ({
					headerTitle: 'Signup',
				})}
			/>
			<Stack.Screen
				name='Wishlist'
				component={WishlistScreen}
				options={() => ({
					headerTitle: 'My Wishlist',
				})}
			/>
			<Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  )
}

export default ProfileStack
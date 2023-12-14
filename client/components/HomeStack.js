// This defines a HomeStack component with multiple screens which serves as a container for the navigation stack.

import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import TrailDetails from './TrailDetails';
import HomeScreen from './HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { iconSize, themeBackgroundColor, themeTintColor, buttonActiveColor, buttonInactiveColor } from '../styles';
import Login from './Login';
import ProfileScreen from './ProfileScreen';
import RecommendationScreen from './RecommendationScreen';
import Signup from './Signup'
import Map from "./Map";
import ProfileStack from './ProfileStack';

const Stack = createNativeStackNavigator();
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: themeBackgroundColor
      },
      headerTintColor: themeTintColor,
    }}>
		<Stack.Screen
    	  name='Home Screen'
    	  component={HomeScreen}
    	  options={() => ({
    	    headerTitle: 'Home',
    	  })}
    	/>
    	<Stack.Screen
    	  name='Details'
    	  component={TrailDetails}
    	  options={() => ({
    	    headerTitle: 'Details',
    	  })}
    	/>
		<Stack.Screen
    	  name='Recommendation'
    	  component={RecommendationScreen}
    	  options={() => ({
    	    headerTitle: 'Recommendation',
    	  })}
    	/>
		<Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  )
}

export default HomeStack
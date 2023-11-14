import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import TrailDetails from './TrailDetail'
import HomeScreen from './HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { iconSize, themeBackgroundColor, themeTintColor, buttonActiveColor, buttonInactiveColor } from '../styles';

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
    </Stack.Navigator>
  )
}

export default HomeStack
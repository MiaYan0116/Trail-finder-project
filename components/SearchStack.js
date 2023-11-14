import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import TrailDetails from './TrailDetail'
import SearchScreen from './SearchScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { iconSize, themeBackgroundColor, themeTintColor, buttonActiveColor, buttonInactiveColor } from '../styles';

const Stack = createNativeStackNavigator();
const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: themeBackgroundColor
      },
      headerTintColor: themeTintColor,
    }}>
			<Stack.Screen
    	  name='SearchScreen'
    	  component={SearchScreen}
    	  options={() => ({
    	    headerTitle: 'Search',
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

export default SearchStack
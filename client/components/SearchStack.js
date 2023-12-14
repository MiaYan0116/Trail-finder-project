// This defines a SearchStack component with multiple screens which serves as a container for the navigation stack.

import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import TrailDetails from './TrailDetails';
import SearchScreen from './SearchScreen';
import ResultsScreen from './ResultsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { iconSize, themeBackgroundColor, themeTintColor, buttonActiveColor, buttonInactiveColor } from '../styles';
import Login from './Login';
import ProfileScreen from './ProfileScreen';
import Signup from './Signup';

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
		 name='SearchResult'
    	  component={ResultsScreen}
    	  options={() => ({
    	    headerTitle: 'Results',
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
				name='ProfileScreen'
				component={ProfileScreen}
				options={() => ({
					headerTitle: 'Profile',
				})}
		/>
    </Stack.Navigator>
  )
}

export default SearchStack
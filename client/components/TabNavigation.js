// This Defines the TabNavigation component, which serves as the root navigation container with bottom tabs.

import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { iconSize } from '../styles';
import colors from "../helper/colors";
import SearchStack from './SearchStack';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator 
      screenOptions={({route}) => ({
				headerStyle: {
          backgroundColor: colors.themeBackgroundColor
        },
        headerTintColor: colors.themeTintColor,
				tabBarIcon: ({ focused }) => {
					let iconName;
					let tabIconColor = focused ? colors.buttonActiveColor : colors.buttonInactiveColor;
		
					if (route.name === 'Home') {
						iconName = 'home'; 
					} else if (route.name === 'Search') {
						iconName = 'search'; 
					} else if (route.name === 'Profile') {
						iconName = 'user'; 
					}
		
					return <FontAwesome name={iconName} size={iconSize} color={tabIconColor} />;
				},
				tabBarActiveTintColor: colors.buttonActiveColor,
				tabBarInactiveTintColor: colors.themeTintColor,
				tabBarStyle: { backgroundColor: colors.themeBackgroundColor },
			})}
  	>
      <Tab.Screen 
				name="Home" 
				component={HomeStack} 
				options={{ headerShown: false }}
			/>
      <Tab.Screen 
				name="Search" 
				component={SearchStack} 
				options={{ headerShown: false }}
			/>
			<Tab.Screen 
				name="Profile" 
				component={ProfileStack} 
				options={{ headerShown: false }}
			/>
    </Tab.Navigator>
  )
}

export default TabNavigation

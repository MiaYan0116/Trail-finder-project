import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { iconSize, themeBackgroundColor, themeTintColor, buttonActiveColor, buttonInactiveColor } from '../styles';
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
          backgroundColor: themeBackgroundColor
        },
        headerTintColor: themeTintColor,
				tabBarIcon: ({ focused }) => {
					let iconName;
					let tabIconColor = focused ? buttonActiveColor : buttonInactiveColor;
		
					if (route.name === 'Home') {
						iconName = 'home'; 
					} else if (route.name === 'Search') {
						iconName = 'search'; 
					} else if (route.name === 'Profile') {
						iconName = 'user'; 
					}
		
					return <FontAwesome name={iconName} size={iconSize} color={tabIconColor} />;
				},
				tabBarActiveTintColor: buttonActiveColor,
				tabBarInactiveTintColor: themeTintColor,
				tabBarStyle: { backgroundColor: themeBackgroundColor },
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

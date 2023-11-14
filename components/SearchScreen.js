import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { iconSize, themeBackgroundColor, themeTintColor, buttonActiveColor, buttonInactiveColor } from '../styles';

const SearchScreen = ({ navigation }) => {
	
	const detailsHandler = () => {
		navigation.navigate("Details")
	}

  return (
    <View>
			<Text>Search</Text>
			<Button title="Details" onPress={detailsHandler}/>
		</View>
  )
}

export default SearchScreen
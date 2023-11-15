import React, { useState } from 'react'
import { StyleSheet, Pressable, ImageBackground, View, TextInput, Text, Button } from 'react-native'
import { iconSize, themeBackgroundColor, themeTintColor, backGroundImage } from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const SearchScreen = ({ navigation }) => {
	const [searchKey, setSearchKey] = useState('');

	const serachKeyChangeHandle = (searchInput) => {
		setSearchKey(searchInput);
	}

	const searchHandler = () => {
		console.log(searchKey);
	}

	const detailsHandler = () => {
		navigation.navigate("Details")
	}

  return (
    <ImageBackground
			source={require('../assets/background_image.jpeg')}
			style={ backGroundImage }
		>
			<View style={styles.container}>
				<View style={styles.inputContainer}>
					<TextInput
						placeholder="Search trails"
						style={styles.input}
						onChangeText={serachKeyChangeHandle}
					/>
					<Pressable
						style={styles.button}
						onPress={searchHandler}
					>
						<Icon name="search" size={24} color="#777" style={styles.button}/>
					</Pressable>
				</View>
				<Button title="Details" onPress={detailsHandler}/>
			</View>
		</ImageBackground>
  )
}
 
const styles = StyleSheet.create({
	container:{
		flex: 1,
		backgroundColor: 'rgba(255,255,255,0.7)', 
		justifyContent: 'flex-start',
  	alignItems: 'center',
	},
	inputContainer: {
    flexDirection: 'row', 
		alignItems: 'center', 
		borderWidth: 1, 
		borderColor: '#696969', 
		borderRadius: 20, 
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
    paddingHorizontal: 5,
		color: "black"
  },
	button:{
		marginRight: 10, 
		color: '#696969' 
	}
})

export default SearchScreen
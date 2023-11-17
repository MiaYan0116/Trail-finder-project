import React, { useState } from 'react'
import { StyleSheet, Pressable, ImageBackground, View, TextInput, Text, Button, ScrollView } from 'react-native'
import { iconSize, themeBackgroundColor, themeTintColor, backGroundImage } from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import SingleButton from './SingleButton'
import DropDownPicker from 'react-native-dropdown-picker';

const SearchScreen = ({ navigation }) => {
	const [searchKey, setSearchKey] = useState("");
	const [rating, setRating] = useState(0);
	const [difficulty, setDifficulty] = useState("");
	const [publicTransit, setPublicTransit] = useState("");
	const [camping, setCamping] = useState("");
	const [dogFriendly, setDogFriendly] = useState("");
	const [ratings, setRatings] = useState([{label: '1', value: '1'},
											{label: '2', value: '2'},
											{label: '2.5', value: '2.5'},
											{label: '3', value: '3'},
											{label: '3.5', value: '3.5'},
											{label: '4', value: '4'},
											{label: '4.5', value: '4.5'},
											{label: '5', value: '5'},
										]);

	const [open, setOpen] = useState(false);
	const ratingOptions = [1, 2, 2.5, 3, 3.5, 4, 4.5, 5];
	const difficultyOptions = ['Easy', 'Difficult', 'Intermediate'];
	const dogOptions = ["FALSE", "TRUE"];
	const publicTransitOptions = ["FALSE", "TRUE"];
	const campingOptions = ["FALSE", "TRUE"];

	/** 
	const searchKeyChangeHandle = (searchInput) => {
		setSearchKey(searchInput);
	}
	*/

	const searchHandler = () => {
		const searchInput = {"rating": rating, "difficulty": difficulty, "publicTransit": publicTransit, "camping": camping, "dogFriendly": dogFriendly};
		setSearchKey(searchInput);
		navigation.navigate('SearchResult', searchInput);
	}

  return (
    <ImageBackground
			source={require('../assets/background_image.jpeg')}
			style={ backGroundImage }
		>	
			<View style={styles.container}>
				{/* Rating Input */}
				<View style={styles.dropDownContainer}>
					<Text style={styles.label}>Rating</Text>
					<DropDownPicker
						style={styles.inputs}
						open={open}
						value={rating}
						items={ratingOptions.map(value => ({ label: `${value}`, value }))}
						setOpen={setOpen}
						setValue={setRating}
						setItems={setRatings}
						multiple={false}
						scrollViewProps={{ maxHeight: 120 }}
					/>
				</View>

				<View style={styles.inputContainer}>
				{/* difficulty Input */}
					<Text style={styles.label}>Difficulty</Text>
					<View style={styles.buttonContainer}>
						<Pressable
							onPress={() => {setDifficulty("Easy")}}
							style={({ pressed }) => [
								{ backgroundColor: pressed ? "darkred" : "green" }, // Change background color on press
								styles.difficultyButton,
								{
									opacity: pressed ? 0.5 : 1, // Change opacity on press
								},
							]}
						>
							<Text style={{color: themeTintColor, fontWeight: 'bold', fontSize: 15}}>Easy</Text>
						</Pressable>
						{/* intermediate button */}
						<Pressable
							onPress={() => {setDifficulty("Intermediate")}}
							style={({ pressed }) => [
								{ backgroundColor: pressed ? "darkred" : "orange" }, // Change background color on press
								styles.difficultyButton,
								{
									opacity: pressed ? 0.5 : 1, // Change opacity on press
								},
							]}
						>
							<Text style={{color: themeTintColor, fontWeight: 'bold', fontSize: 15}}>Intermediate</Text>
						</Pressable>
						{/* difficult button */}
						<Pressable
							onPress={() => {setDifficulty("Difficult")}}
							style={({ pressed }) => [
								{ backgroundColor: pressed ? "darkred" : "red" }, // Change background color on press
								styles.difficultyButton,
								{
									opacity: pressed ? 0.5 : 1, // Change opacity on press
								},
							]}
						>
							<Text style={{color: themeTintColor, fontWeight: 'bold', fontSize: 15}}>Hard</Text>
						</Pressable>
					</View>
				</View>


				{/* PublicTransit Input */}
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Public Transit</Text>
					<View style={styles.buttonContainer}>
						<Pressable
							onPress={() => {setPublicTransit("TRUE")}}
							style={({ pressed }) => [
								styles.button,
								{
									opacity: pressed ? 0.5 : 1,
								},
							]}
						>
							<Text style={{color: themeBackgroundColor, fontWeight: 'bold', fontSize: 15}}>Yes</Text>
						</Pressable>
						<Pressable
							onPress={() => {setPublicTransit("FALSE")}}
							style={({ pressed }) => [
								styles.button,
								{
									opacity: pressed ? 0.5 : 1,
								},
							]}
						>
							<Text style={{color: themeBackgroundColor, fontWeight: 'bold', fontSize: 15}}>No</Text>
						</Pressable>
					</View>
				</View>

				{/* Camping Input */}
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Camping</Text>
					<View style={{marginLeft: 40, flexDirection: 'row', }}>
						<Pressable
							onPress={() => {setCamping("TRUE")}}
							style={({ pressed }) => [
								styles.button,
								{
									opacity: pressed ? 0.5 : 1,
								},
							]}
						>
							<Text style={{color: themeBackgroundColor, fontWeight: 'bold', fontSize: 15}}>Yes</Text>
						</Pressable>
						<Pressable
							onPress={() => {setCamping("FALSE")}}
							style={({ pressed }) => [
								styles.button,
								{
									opacity: pressed ? 0.5 : 1,
								},
							]}
						>
							<Text style={{color: themeBackgroundColor, fontWeight: 'bold', fontSize: 15}}>No</Text>
						</Pressable>
					</View>
    		</View>

				{/* DogFrinendly Input */}
					<View style={styles.inputContainer}>
						<Text style={styles.label}>Dog Friendly</Text>
						<View style={styles.buttonContainer}>
							<Pressable
								onPress={() => { setDogFriendly("TRUE") }} 
								style={({ pressed }) => [
									styles.button,
									{
										opacity: pressed ? 0.5 : 1,
									},
								]}
							>
								<Text style={{ color: themeBackgroundColor, fontWeight: 'bold', fontSize: 15 }}>Yes</Text>
							</Pressable>
							<Pressable
								onPress={() => { setDogFriendly("FALSE") }} 
								style={({ pressed }) => [
									styles.button,
									{
										opacity: pressed ? 0.5 : 1,
									},
								]}
							>
								<Text style={{ color: themeBackgroundColor, fontWeight: 'bold', fontSize: 15 }}>No</Text>
							</Pressable>
						</View>
					</View>

					<View style={styles.buttonContainer}>
						<View style={{ width: '100%', alignItems: 'center' }}>
							<SingleButton text={'Search'} handlefunc={searchHandler} />
						</View>
					</View>
					
				</View>
		</ImageBackground>
  )
}

 
const styles = StyleSheet.create({
	container:{
		flex: 1,
		backgroundColor: 'rgba(255,255,255,0.7)', 
		paddingVertical: 30,
		zIndex: 999,
	
	},
	inputContainer: {
		flexDirection: 'row', 
		alignItems: 'center', 
		justifyContent: 'flex-start',
		width: '85%',
		padding: 5,
		marginTop: 10,
		marginHorizontal: 30,
		zIndex: 999,
	},
	dropDownContainer: {
		flexDirection: 'row', 
		alignItems: 'center', 
		justifyContent: 'flex-start',
		width: '85%',
		padding: 5,
		marginTop: 10,
		marginHorizontal: 30,
		zIndex: 1000,
	},
	inputs: {
		backgroundColor: 'transparent',
		borderColor: themeTintColor,
		borderRadius: 5,
		margin: 15,
		height: 20,
		width: '90%',
		zIndex: 1001,
	},
	label: {
		fontWeight: 'bold',
		fontSize: 16,
		color: themeBackgroundColor
	},
	buttonContainer:{ 
		marginLeft: 10, 
		marginVertical: 5,
		flexDirection: 'row', 
		zIndex: 999,
	},
	difficultyButton: {
		height: 30,
		justifyContent: 'center',
		width: 80,
		alignItems: 'center',
		borderRadius: 10,
		marginLeft: 10,
		zIndex: 999,
	},
	button: {
		marginHorizontal: 10,
		height: 45,
    	width: 45,
		borderWidth: 0.5,
		borderRadius: 25, // Half of the height for a perfect circle
		backgroundColor: 'transparent', // You can change the background color as needed
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 999,
	}
	
})

export default SearchScreen
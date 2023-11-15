import React from 'react'
import { Image, Text, View, StyleSheet, Pressable } from 'react-native'
import {themeBackgroundColor, buttonborderRadius, themeTintColor, buttonFontSize, buttonInactiveColor } from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome';

export const TopTrailsItem = (props) => {
	// console.log(props);
	const rate = props.item.rating;
	const fullStars = Math.floor(rate);
  	const halfStar = rate - fullStars >= 0.5 ? 1 : 0;

	const stars = Array.from({ length: fullStars }, (_, index) => (
		<Icon key={index} name="star" size={14} color="#FFD700" />
	)).concat(
		halfStar === 1 ? <Icon key="half-star" name="star-half" size={14} color="#FFD700" /> : null
	);

	const itemPressed = () => {
		props.itemPressHandle(props.item)
	}

  return (
    <Pressable style={styles.container} onPress={itemPressed}>
			
			<Image 
				source={{ uri: props.item.imageUri }} 
				style={styles.image}
			/>
			
			<View style={styles.content}>
				<Text style={styles.text}>{props.item.trailTitle}</Text>
			</View>
			<View style={styles.starsContainer}>{stars}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		borderWidth: 1.5,
		borderColor: '#d2b48c',
		borderRadius: 5,
		marginHorizontal: 5,
		overflow: 'hidden',
		width: 145,
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	text:{
		padding: 7,
		fontSize: 16,
	},
	starsContainer: {
    position: 'absolute', 
    flexDirection: 'row',
    alignItems: 'center',
    top: 7, 
    right: 10, 
  },
	image: {
    width: '100%',
    height: 210,
  },
})
export default TopTrailsItem;
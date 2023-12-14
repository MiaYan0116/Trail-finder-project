// The ListSingleTrailItem represents a single item in a list of trails, which ensure the modularity of the app.
import React, { useState, useEffect } from 'react'
import { Image, Text, View, StyleSheet, Pressable } from 'react-native'
import colors from "../helper/colors";
import RatingStars from './RatingStars';

const ListSingleTrailItem = (props) => {
	
	const item = props.item;
	const rate = item.rating;
	const imageUri = item.imageUri;
	const itemPressed = () => {
		props.itemPressHandle(props.item)
	}

  return (
    <Pressable 
		style={styles.container} 
		onPress={itemPressed}>
			<View style={styles.content}>
				<Text style={styles.text}>{props.item.trailTitle}</Text>
			</View>
			<Image 
				source={{ uri: imageUri }} 
				style={styles.image}
			/>
			
			<View style={styles.starsContainer}>{RatingStars({ rate })}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		
		marginHorizontal: 5,
		overflow: 'hidden',
		width: 350,
		marginBottom: 10,
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	text:{
		padding: 7,
		fontSize: 22,
		fontWeight: 'bold',
		color: colors.themeBackgroundColor
	},
	starsContainer: {
    position: 'absolute', 
    flexDirection: 'row',
    alignItems: 'center',
    top: 10, 
    right: 10, 
  },
	image: {
    width: '100%',
    height: 210,
		borderRadius: 15
  },
})
export default ListSingleTrailItem;
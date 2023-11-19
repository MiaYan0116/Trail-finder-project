import React, { useState, useEffect } from 'react'
import { Image, Text, View, StyleSheet, Pressable } from 'react-native'
import {themeBackgroundColor, buttonborderRadius, themeTintColor, buttonFontSize, buttonInactiveColor } from '../styles'

import  RatingStars from './RatingStars';

export const TopTrailsItem = (props) => {
	
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
			<Image 
				source={{ uri: imageUri }} 
				style={styles.image}
			/>
			<View style={styles.content}>
				<Text style={styles.text}>{props.item.trailTitle}</Text>
			</View>
			<View style={styles.starsContainer}>{RatingStars({ rate })}</View>
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
		marginBottom: 10,
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
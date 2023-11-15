import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'


// break down the entry list into appropriate and reusbale EntryItem
const TrailItem = ({ item, navigation }) => {

    const rate = item.rating;
	const fullStars = Math.floor(rate);
  	const halfStar = rate - fullStars >= 0.5 ? 1 : 0;

	const stars = Array.from({ length: fullStars }, (_, index) => (
		<Icon key={index} name="star" size={14} color="#FFD700" />
	)).concat(
		halfStar === 1 ? <Icon key="half-star" name="star-half" size={14} color="#FFD700" /> : null
	);
      
     return (
        <PressableButton
            style={styles.container}
            onPress={() =>
                navigation.navigate("Details", {
                    camping: item.camping,
                    difficulty: item.difficulty,
                    dogFriendly: item.dogFriendly,
                    id: item.id,
                    publicTransit: item.publicTransit,
                    rating: item.rating,
                    trailTitle: item.trailTitle,
                    imageUri: item.imageUri,
                })
            }
        >
            <Image 
                source={{ uri: item.imageUri }} 
                style={styles.image} 
            />
            <View style={styles.content}>
			<Text style={styles.text}>{item.trailTitle}</Text>
            </View>
            <View style={styles.starsContainer}>{stars}</View>
        </PressableButton>
      )
  }


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

export default TrailItem
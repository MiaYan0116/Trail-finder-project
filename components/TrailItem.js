import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

const [imageUri, setImageUri] = useState("");

// break down the entry list into appropriate and reusbale EntryItem
const TrailItem = ({ item, navigation }) => {

    useEffect(async () => {

        const response = await fetch(`https://api.bing.microsoft.com/v7.0/images/search?q=${item.trailTitle}`, {
            method: 'GET',
            headers: {
              'Ocp-Apim-Subscription-Key': '8f17ea6d1c9a427aa26d4ff9cbe799b6',
            },
        });
        const data = await response.json();
        const uri = data.value[0].webSearchUrl;
        setImageUri(uri);
        }, [item.trailTitle]); 
      
     return (
        <PressableButton
            style={styles.itemStyle}
            pressHandler={() =>
                navigation.navigate("Details", {
                    camping: item.camping,
                    difficulty: item.difficulty,
                    dogFriendly: item.dogFriendly,
                    id: item.id,
                    publicTransit: item.publicTransit,
                    rating: item.rating,
                    trailTitle: item.trailTitle,
                    imageUri: {imageUri},
                })
            }
        >
            <View>
                <Text >{item.trailTitle}</Text>
                <Text>{item.rating}</Text>
                <Text>{item.publicTransit}</Text>
                <Text>{item.dogFriendly}</Text>
                <Text>{item.difficulty}</Text>
                <Text>{item.camping}</Text>
            </View>
        </PressableButton>
      )
  }


const styles = StyleSheet.create({
	container:{
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)', 
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
	},
	image: {
        marginVertical: 20,
        marginLeft: 130,
        width: 180,
        height: 180,
        resizeMode: 'cover',
    },
})

export default TrailItem
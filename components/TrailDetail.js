import React from 'react'
import { Image, StyleSheet, View, Text } from 'react-native'

const TrailDetails = ({ navigation, route }) => {
  console.log(route.params)
  return (
    <View>
      <Text>{route.params.pressedItem.name}</Text>
      <Text>{route.params.pressedItem.rate}</Text>
      <Image
        source={{uri: route.params.pressedItem.imageuri}} 
        style={styles.image}
      />
    </View>
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

export default TrailDetails
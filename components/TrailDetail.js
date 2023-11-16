import React from 'react'
import { Image, StyleSheet, View, Text } from 'react-native'
import { themeBackgroundColor } from '../styles'
import RatingStars from './RatingStars'
import Icon from 'react-native-vector-icons/FontAwesome';

const TrailDetails = ({ navigation, route }) => {
  console.log('details:',route.params)
  const item = route.params.pressedItem;
  const imageUri = route.params.imageUri;
  const rate = item.rating;
  let publicTransit;
  let dogFriendly;
  let camping;
  if(item.publicTransit === false){
    publicTransit = 'No';
  }else{
    publicTransit = 'Yes';
  }
  if(item.dogFriendly === false){
    dogFriendly = 'No';
  }else{
    dogFriendly = 'Yes';
  }
  if(item.camping === false){
    camping = 'No';
  }else{
    camping = 'Yes';
  }
  

  return (
    <View style={styles.container}>
			<Image
				source={{uri: imageUri}}
				style={styles.image}
			/>
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{item.trailTitle}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.listItem}>
            <View style={styles.iconContainer}>
              <Icon name='star' size={20} color={themeBackgroundColor} />
            </View>
            <View>
              <Text style={styles.label}>Rating</Text>
              <Text>{RatingStars({ rate })}</Text>
            </View>
          </View>
          <View style={styles.listItem}>
            <View style={styles.iconContainer}>
              <Icon name='bus' size={20} color={themeBackgroundColor} />
            </View>
            <View>
              <Text style={styles.label}>Public Transit</Text>
              <Text>{publicTransit}</Text>
            </View>
          </View>
          <View style={styles.listItem}>
            <View style={styles.iconContainer}>
              <Icon name='paw' size={20} color={themeBackgroundColor} />
            </View>
            <View>
              <Text style={styles.label}>Dog Friendly</Text>
              <Text>{dogFriendly}</Text>
            </View>
          </View>
          <View style={styles.listItem}>
            <View style={styles.iconContainer}>
              <Icon name='wrench' size={20} color={themeBackgroundColor} />
            </View>
            <View>
              <Text style={styles.label}>Difficulty</Text>
              <Text>{item.difficulty}</Text>
            </View>
          </View>
          <View style={styles.listItem}>
            <View style={styles.iconContainer}>
              <Icon name='fire' size={20} color={themeBackgroundColor} />
            </View>
            <View>
              <Text style={styles.label}>Camping</Text>
              <Text>{camping}</Text>
            </View>
          </View>
        </View>
      </View>
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
    marginTop: 40,
		marginBottom: 20,
    marginLeft: 40,
    width: '80%',
    height: 260,
    resizeMode: 'cover',
  },
  titleContainer:{
		width: '100%',
    height: 50,
    paddingHorizontal: 15,
		marginLeft: 40,
		alignItems: 'center'
	},
	titleText: {
		fontSize: 30,
		fontWeight: 'bold',
		color: themeBackgroundColor
	},
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 7, 
    right: 10, 
  },
  infoContainer: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginLeft: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7
  },
  iconContainer: {
    marginRight: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 17,
    color: themeBackgroundColor
  },
})

export default TrailDetails
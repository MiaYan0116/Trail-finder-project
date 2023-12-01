import React, { useEffect, useState } from 'react'
import { Pressable, Image, StyleSheet, View, Text, ScrollView, Alert } from 'react-native'
import { db, auth } from '../firebase/firebaseSetup';
import { themeBackgroundColor } from '../styles'
import RatingStars from './RatingStars'
import Icon from 'react-native-vector-icons/FontAwesome';
import { getUserByUserAuthId, addWishItemToFireStore, deleteWishItemFromFireStore, updateUser } from '../firebase/firestore';
import { Calendar } from 'react-native-calendars';
import { mapAPIKey } from '@env';

const TrailDetails = ({ navigation, route }) => {

  const item = route.params.pressedItem;
  console.log(item);
  const [isLiked, setIsLiked] = useState(false);
  const imageUri = item.imageUri;
  const rate = item.rating;
  let publicTransit;
  let dogFriendly;
  let camping;
  if(item.publicTransit === "FALSE"){
    publicTransit = 'No';
  }else{
    publicTransit = 'Yes';
  }
  if(item.dogFriendly === "FALSE"){
    dogFriendly = 'No';
  }else{
    dogFriendly = 'Yes';
  }
  if(item.camping === "FALSE"){
    camping = 'No';
  }else{
    camping = 'Yes';
  }
  
  const [user, setUser] = useState({});
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [userCid, setUserCid] = useState('');
  const [wishitems, setWishitems] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser) {
          const { userData, userId } = await getUserByUserAuthId(auth.currentUser.uid);
          setUser(userData || {});
          setDescription(userData.description || '');
          setUsername(userData.username || '');
          setUserCid(userId || '');
          setWishitems(userData.wishitems || '');
          const isTrailTitleIncluded = userData.wishitems.some(wishitem => wishitem.trailTitle === item.trailTitle);
          setIsLiked(isTrailTitleIncluded);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);

  const handleIsLiked = () => {
    setIsLiked((prevIsLiked) => {
      const newIsLiked = !prevIsLiked;
      if (newIsLiked) {
        const wishData = {"userCid": userCid, "trailTitle": item.trailTitle}
        addWishItemToFireStore(wishData);
        setWishitems((prevWishitems) => {
          const newWishitems = [...prevWishitems, wishData]
          updateUser(userCid, {wishitems: newWishitems});
          return newWishitems;
        });
      } else {
        deleteWishItemFromFireStore(userCid, item.trailTitle);
        setWishitems((prevWishitems) => {
          const newWishitems = prevWishitems.filter((wishItem) => wishItem.trailTitle != item.trailTitle);
          updateUser(userCid, {wishitems: newWishitems});
          return newWishitems;
        })
      }
      return newIsLiked;
    })
  }

  const handlePress = () => {
    if (auth.currentUser) {       
      handleIsLiked();
    } else {
      Alert.alert("You need to login first");
      navigation.navigate('Login');
    }
  }



  return (
    <ScrollView style={styles.container}>
			<Image
				source={{uri: imageUri}}
				style={styles.image}
			/>
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{item.trailTitle}</Text>
          <Pressable onPress={handlePress}>
            {({ pressed }) => (
              <Icon
                name={isLiked ? 'heart' : 'heart-o'}
                size={25}
                color={pressed ? 'gray' : themeBackgroundColor}
              />
            )}
          </Pressable>
 
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
		</ScrollView>
  )
}

const styles = StyleSheet.create({
	container:{
		flex: 1,
		backgroundColor: 'rgba(255,255,255,0.7)', 
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
		marginLeft: 35,
    flexDirection: "row",
    
	},
	titleText: {
		fontSize: 30,
		fontWeight: 'bold',
		color: themeBackgroundColor,
    marginRight: 25,
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
import React, { useState, useEffect } from 'react'
import { Pressable, FlatList, Image, ImageBackground, StyleSheet, View, Text, Button, ScrollView, Alert } from 'react-native'
import { backGroundImage } from '../styles';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TopTrailsItem from './TopTrailsItem';
import { db, auth } from '../firebase/firebaseSetup'
import { getUserByUserAuthId } from '../firebase/firestore';
import { collection, orderBy, query, limit, getDocs } from "firebase/firestore";
import colors from "../helper/colors";
import fontSizes from "../helper/fontSizes";


// Top five trails and recommendation button are shown in the HomeScreen
const Stack = createNativeStackNavigator();
const HomeScreen = ({ navigation, route }) => {
  //console.log("home: ", auth.currentUser);

  const [topTrails, setTopTrails] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser) {
          const { userData, userId } = await getUserByUserAuthId(auth.currentUser.uid);
          setUserId(userData.uid);
        }
      } catch (error) {
      console.error('Error fetching user data:', error);
      }
    };
      fetchUserData();
  })



  useEffect(() => {
    const fetchTopTrails = async () => {
      const trailsRef = collection(db, 'traillist');
      const q = query(trailsRef, orderBy('rating', 'desc'), limit(5))
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => doc.data());
      setTopTrails(documents);
    };
    fetchTopTrails();
  }, []);

  // user can navigate to Details screen by pressing on the image of any trail. 
  const detailsHandler = (pressedItem) => {
		navigation.navigate('Details', {pressedItem});
	}

  const renderItem = ({ item }) => (
    <TopTrailsItem item={item} itemPressHandle={detailsHandler} />
  );

  // user can navigate to Recommendation screen by pressing the image on the bottom of the screen.
  // if the wishlist is empty, an alert will appear.
  // if the user is not logged in, he/she will be directed to login first.
  const tailorPressedHandle = async () => {
    if (auth.currentUser) {
      const user = await getUserByUserAuthId(auth.currentUser.uid);
      if(user.userData.wishitems){
        navigation.navigate('Recommendation', userId);
      }else{
        Alert.alert("You need to add some trails first");
      }
      
    } else {
      Alert.alert("You need to login first");
      navigation.navigate('Profile', {screen: 'ProfileScreen'});
    }
  }

  return (
    <ImageBackground
			source={require('../assets/background_image.jpeg')}
			style={ backGroundImage }
		>
			<ScrollView style={styles.container}>
				<Image 
          source={require('../assets/trail_logo.png')} 
          style={styles.image}
        />
        <Text style={styles.listTitle}>Top 5 Trails</Text>
        <View style={styles.listContainer}>
          <FlatList
            data={topTrails}
            horizontal={true}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false} 
          />
        </View>
        <Pressable style={styles.tailorContainer} onPress={tailorPressedHandle}>
          <Image
            source={require('../assets/tailor_image.jpeg')}
            style={styles.tailorImage}
          />
          <View style={styles.tailorTextContainer}>
            <Text style={styles.tailorText}>Tailor Your Trails!</Text>
          </View>
        </Pressable>
			</ScrollView>
		</ImageBackground>
  )
}
const styles = StyleSheet.create({
	container:{
		flex: 1,
		backgroundColor: colors.background, 
    width: '100%',
	},
	image: {
    marginLeft: 120,
    width: 200,
    height: 130,
    resizeMode: 'contain',
  },
  listTitle: {
    fontSize: fontSizes.median,
    marginLeft:15,
    marginBottom: 8,
    textAlign: 'left'
  },
  listContainer:{
    marginHorizontal: 10,
    flexDirection: 'row'
  },
  tailorContainer:{
    position: 'relative',
    width: '92%',
    marginLeft: 20,
    marginRight: 20,
    marginVertical: 20,
  },
  tailorImage:{
    width: '100%',
    marginTop: 15,
    height: 240,
    borderRadius: 15,
  },
  tailorTextContainer:{
    position: 'absolute',
    bottom: 40, 
    right: 32,
  },
  tailorText:{
    fontSize: fontSizes.extralarge,
    color: colors.white,
    fontWeight: 'bold',
  }

})

export default HomeScreen
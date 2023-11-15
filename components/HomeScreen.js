import React, { useState, useEffect } from 'react'
import { Pressable, FlatList, Image, ImageBackground, StyleSheet, View, Text, Button } from 'react-native'
import { backGroundImage } from '../styles';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from 'react-native-vector-icons/FontAwesome';
import TopTrailsItem from './TopTrailsItem';
import { db } from '../firebase/firebaseSetup'
import { collection, orderBy, query, limit, getDocs } from "firebase/firestore";

const Stack = createNativeStackNavigator();
const HomeScreen = ({ navigation, route }) => {
  const list = [
    {name: 'Grouse Grind', rate: 4.5, imageUri: "https://insidevancouver.ca/wp-content/uploads/2013/08/Grousegrind2.jpeg"},
    {name: "St Mark's Summit", rate: 4.0, imageUri: 'https://www.insidevancouver.ca/wp-content/uploads/2021/08/vlad-d-ytAt9TT-X38-unsplash-664x434.jpg'},
    {name: "Sea To Summit", rate: 4.0, imageUri: 'https://grindaholic.ca/wp-content/uploads/2020/06/Sea-to-summit-trail.jpg'},
    {name: "Quarry Rock", rate: 4.5, imageUri: 'https://images.dailyhive.com/20170825082201/north-vancouver-quarry-rock-hiking-deep-cove.jpg'},
    {name: "Tunnel Bluffs", rate: 4.7, imageUri: 'https://cdn-assets.alltrails.com/uploads/photo/image/62578510/b7c02601ffc90c343f6449758f7676f8.jpg'}
  ]

  const [topTrails, setTopTrails] = useState([]);

  useEffect(() => {
    const fetchTopTrails = async () => {
      const trailsRef = collection(db, 'traillist');
      const q = query(trailsRef, orderBy('rating', 'desc'), limit(5))
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => doc.data());
      console.log(documents);
    };
    fetchTopTrails();
  }, []);

  const detailsHandler = (pressedItem) => {
		navigation.navigate('Details', {pressedItem});
	}

  const renderItem = ({ item }) => (
    <TopTrailsItem item={item} itemPressHandle={detailsHandler} />
  );

  const tailorPressedHandle = () => {
    console.log("tailor pressed")
  }

  return (
    <ImageBackground
			source={require('../assets/background_image.jpeg')}
			style={ backGroundImage }
		>
			<View style={styles.container}>
				<Image 
          source={require('../assets/trail_logo.png')} 
          style={styles.image}
        />
        <Text style={styles.listTitle}>Top 5 Trails</Text>
        <View style={styles.listContainer}>
          <FlatList
            data={list}
            horizontal={true}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
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
			</View>
		</ImageBackground>
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
    marginLeft: 120,
    width: 200,
    height: 130,
    resizeMode: 'contain',
  },
  listTitle: {
    fontSize: 20,
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
    right: 20,
  },
  tailorText:{
    fontSize: 35,
    color: 'white',
    fontWeight: 'bold'
  }

})

export default HomeScreen
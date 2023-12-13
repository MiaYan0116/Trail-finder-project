import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, Alert, Text } from 'react-native'
import axios from 'axios';
import ListSingleTrailItem from './ListSingleTrailItem';
import { urlDomain } from "@env";
import { getTrailItemByTrailId } from '../firebase/firestore';
import { auth } from '../firebase/firebaseSetup';
import LocationManager from './LocationManager';
import { updateUser, getUserByUserAuthId } from '../firebase/firestore';


const RecommendationScreen = ({ navigation, route }) => {
  const [recommendationList, setRecommendationList] = useState([]);
  const [recommendationTrails, setRecommendationTrails] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [userCid, setUserCid] = useState('');
  const [userUid, setUserUid] = useState('');
  const [isWishListExist, setIsWishlistExist] = useState(false);


  const renderItem = ({ item }) => (
    <ListSingleTrailItem item={item} itemPressHandle={detailsHandler} />
  );

  const detailsHandler = (pressedItem) => {
		navigation.navigate('Details', {pressedItem});
	}


  useEffect(() => {
    //we have to use a separate function because the effect function can not be marked async
    async function getRecommendationResult() {
      try {
        if (auth.currentUser) {
          const { userData, userId } = await getUserByUserAuthId(auth.currentUser.uid);          
          if (userData.wishitems && userData.wishitems.length > 0) {
            setUserCid(userId || '');
            setUserUid(userData.uid || '');
            setIsWishlistExist(true);
            const response = await axios.get(
              `http://${urlDomain}:8000/recommendation/${userData.uid}`, {withCredentials: true,}
            );
            // data is converted from JSON to JS object
            const data = response.data;
            const fixedJsonString = data.replace(/'/g, '"');
            const validJsonString = fixedJsonString.slice(0, -1);
            const resultDict = JSON.parse(validJsonString);
            const resultArray = Object.entries(resultDict);
            setRecommendationList(resultArray);
          } else {
            Alert.alert("You need to add some trails first");
          }}       
      } catch (err) {
        console.log("error in fetching users data ", err);
      }
    }
    getRecommendationResult();
  }, []);

  
  useEffect(() => {
    async function fetchTrails() {
      try {
        const trailPromises = recommendationList.map(input => getTrailItemByTrailId(input[0]));
        const trails = await Promise.all(trailPromises);
        setRecommendationTrails(trails);
        updateUser(userCid, {recommendationitems: trails});
        setLocationList(trails.map(trail => trail.geo));
      } catch (err) {
        console.log("error in get the recommendation trail list.", err)
      }
    }
  
    if (recommendationList.length > 0) {
      fetchTrails();
    }
  }, [recommendationList]);

  return (
    <View>
      <LocationManager locationList={locationList}/>
      <View style={styles.listContainer}>
        { isWishListExist ? 
        (<FlatList
          data={recommendationTrails}
          horizontal={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={true}
        />) : 
        (<Text style={styles.text}>No recommended item found.</Text>)
        }
      </View> 
    </View> 
  )
}

const styles = StyleSheet.create({
  listContainer:{
    flexDirection: 'column',
    width: '92%',
    marginLeft: 20,
    marginRight: 20,
    marginVertical: 20,
    alignItems: 'center',
  },
  
})

export default RecommendationScreen
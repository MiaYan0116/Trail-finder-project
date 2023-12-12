import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import axios from 'axios';
import ListSingleTrailItem from './ListSingleTrailItem';
import { urlDomain } from "@env";
import { getTrailItemByTrailId } from '../firebase/firestore';
import LocationManager from './LocationManager';


const RecommendationScreen = ({ navigation, route }) => {
  //console.log(route.params);
  const userId = route.params;
  const [recommendationList, setRecommendationList] = useState([]);
  const [recommendationTrails, setRecommendationTrails] = useState([]);
  const [locationList, setLocationList] = useState([]);


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
        const response = await axios.get(
          `http://${urlDomain}:8000/recommendation/${userId}`, {withCredentials: true,}
        );
        // data is converted from JSON to JS object
        const data = response.data;
        const fixedJsonString = data.replace(/'/g, '"');
        const validJsonString = fixedJsonString.slice(0, -1);
        const resultDict = JSON.parse(validJsonString);
        const resultArray = Object.entries(resultDict);
        setRecommendationList(resultArray);
      } catch (err) {
        console.log("error in fetching users data ", err);
      }
    }
    getRecommendationResult();
  }, []);

  
  useEffect(() => {
    async function getRecommendationTrailList(inputList) {
      try {
        let trailArray = [];
        let locationArray = [];
        inputList.map(async (input) => {
          const recommendedTrail = await getTrailItemByTrailId(input[0]);
          console.log(recommendedTrail);
          trailArray.push(recommendedTrail);
          locationArray.push(recommendedTrail.geo);
        })
        setRecommendationTrails(trailArray);
        setLocationList(locationArray);
      } catch (err) {
        console.log("error in get the recommendation trail list.")
      }
    }
    getRecommendationTrailList(recommendationList);
  }, [recommendationList]);





  return (
    <View>
      <LocationManager locationList={locationList}/>
      <View style={styles.listContainer}>
        <FlatList
          data={recommendationTrails}
          horizontal={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={true}
        />
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
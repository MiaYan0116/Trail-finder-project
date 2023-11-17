import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import TopTrailsItem from './TopTrailsItem';
import {
  collection,
  onSnapshot, 
  query, 
  where, 
} from "@firebase/firestore";
import { db } from "../firebase/firebaseSetup";

const ResultsScreen = ({ navigation, route }) => {
  const [resultList, setResultList] = useState([]);
  const { camping, difficulty, dogFriendly, publicTransit, rating } = route.params;
  const ratingUpperLimit = rating + 0.5;

  const renderItem = ({ item }) => (
    <TopTrailsItem item={item} itemPressHandle={detailsHandler} />
  );

  const detailsHandler = (pressedItem) => {
		navigation.navigate('Details', {pressedItem});
	}


  useEffect(() => {
    const q = query(
      collection(db, "traillist"),
      where("camping", "==", camping),
      where("difficulty", "==", difficulty),
      where("dogFriendly", "==", dogFriendly),
      where("publicTransit", "==", publicTransit),      
      where("rating", "<", ratingUpperLimit),
      where("rating", ">=", rating),
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let newArray = [];
        if (!querySnapshot.empty) {
          // use a for loop to call .data() on each item of querySnapshot.docs
          querySnapshot.docs.forEach((docSnap) => {
            newArray.push({ ...docSnap.data(), id: docSnap.id });
          });
        }
        setResultList(newArray);
        console.log(resultList);
      },
      (err) => {
        console.log(err);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);


  return (
    <View style={styles.listContainer}>
      <FlatList
        data={resultList}
        horizontal={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={true}
      />
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

export default ResultsScreen
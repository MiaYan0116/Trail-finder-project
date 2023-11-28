import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, Text } from 'react-native'
import TopTrailsItem from './TopTrailsItem';
import {
  collection,
  onSnapshot, 
  query, 
  where, 
} from "@firebase/firestore";
import { db, auth } from "../firebase/firebaseSetup";
import { getWishlistByUserAuthId, getTrailItemByTrailTitle } from '../firebase/firestore';

const WishlistScreen = ({ navigation, route }) => {

  const userCid = auth.currentUser.uid;
  const [wishList, setWishList] = useState([]);
  const [trailList, setTrailList] = useState([]);
  const [isWishListExist, setIsWishListExist] = useState(false);
  

  const renderItem = ({ item }) => (
    <TopTrailsItem item={item} itemPressHandle={detailsHandler} />
  );

  const detailsHandler = (pressedItem) => {
    console.log(pressedItem.trailTitle);
		navigation.navigate('Details', {pressedItem});
	}

  useEffect(() => {
    const q = query(
      collection(db, "wishlist"),
      where('userCid', '==', userCid),
    );

    const unsubscribe = onSnapshot(
      q,
      async (querySnapshot) => {
        let newArray = [];
        if (!querySnapshot.empty) {
          // use a for loop to call .data() on each item of querySnapshot.docs
          querySnapshot.docs.forEach((docSnap) => {
            newArray.push({...docSnap.data(), id: docSnap.id});
          });
        }
        setIsWishListExist(newArray && newArray.length);
        setWishList(newArray);
        const trailListDerived = await getTrailListFromWishList(wishList);
        setTrailList(trailListDerived);
        
      },
      (err) => {
        console.log(err);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);


  const getTrailListFromWishList = async (wishListInput) => {
    const newTrailList = await Promise.all(wishListInput.map(async (wishItem) => {
        return getTrailItemByTrailTitle(wishItem);
      }));
    console.log(newTrailList);
    return newTrailList;
  }


  return (
    <View style={styles.listContainer}>
      { isWishListExist ? 
      (<FlatList
        data={trailList}
        horizontal={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={true}
      />) :
      (<Text style={styles.text}>No wish item found.</Text>)
      }
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

export default WishlistScreen
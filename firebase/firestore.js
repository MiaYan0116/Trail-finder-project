/*
This file contains asynchronous firestore operations.
*/

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
  query, 
  where, 
  getDocs,
} from "@firebase/firestore";
import { db } from "./firebaseSetup";
import { auth } from './firebaseSetup';

export async function addInitialDataToFirestore(data) {
  try {
    const { trailTitle } = data;

    // Check if a document with the given trailTitle already exists
    const trailsRef = collection(db, 'traillist');
    const q = query(trailsRef, where('trailTitle', '==', trailTitle));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // No existing document found, add the new one
      await addDoc(trailsRef, data);
      console.log(`Document with trailTitle ${trailTitle} added to Firestore.`);
    } else {
      console.log(`Document with trailTitle ${trailTitle} already exists in Firestore. Skipped.`);
    }
  } catch (err) {
    logError(err);
  }
}

export const addUserToFireStore = async (user) => {
  try {
    const userRef = collection(db, 'users');
    const docRef = await addDoc(userRef, user);
    const documentId = docRef.id;
    return documentId;
  } catch (error) {
    logError(error);
  }
}


export const addWishItemToFireStore = async (wishData) => {
  wishData.createdAt = Timestamp.now();
  try {
    const { userCid, trailTitle } = wishData;
    // Check if a document with the given wishData already exists
    const wishlistRef = collection(db, 'wishlist');
    const q = query(wishlistRef, where('userCid', '==', userCid), where('trailTitle', '==', trailTitle));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // No existing document found, add the new one
      await addDoc(wishlistRef, wishData);
      console.log(`Document with trailTitle ${trailTitle} and userCid ${userCid} added to wishlist of Firestore.`);
    } else {
      console.log(`Document with trailTitle ${trailTitle} and userCid ${userCid} already exists in the wishlist of Firestore. Skipped.`);
    }
  } catch (err) {
    logError(err);
  }

}


export const deleteWishItemFromFireStore = async (userCid, trailTitle) => {
  try {
    const wishlistRef = collection(db, 'wishlist');
    
    // Check if a document with the given userCid and trailTitle exists
    const q = query(wishlistRef, where('userCid', '==', userCid), where('trailTitle', '==', trailTitle));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);

    if (!querySnapshot.empty) {
      // Document found, delete it
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        console.log(`Document with trailTitle ${trailTitle} and userCid ${userCid} deleted from wishlist in Firestore.`);
      });
    } else {
      console.log(`Document with trailTitle ${trailTitle} and userCid ${userCid} not found in the wishlist of Firestore. Nothing to delete.`);
    }
  } catch (err) {
    logError(err);
  }
};


/**
export const getWishListByUserAuthId = async (userAuthId) => {
  try {
    const wishlistCollection = collection(db, 'wishlist');
    const q = query(wishlistCollection, where('uid', '==', userAuthId));

  } catch (error) {
    console.error('Error getting the wishlist by userAuthId:', error);
  }
}
*/

export const getTrailItemByTrailTitle = async (wishItem) => {
  try {
    const trailsCollection = collection(db, 'traillist');
    const q = query(trailsCollection, where('trailTitle', '==', wishItem.trailTitle));
    const querySnapshot = await getDocs(q);

    console.log(querySnapshot.docs[0].data());
    if (querySnapshot.size > 0) {
      const trailData = querySnapshot.docs[0].data();
      return trailData;
    } else {
      console.log('No matching document found');
    }
  } catch (error) {
    console.error('Error getting trailItem by trailTitle:', wishItem.trailTitle);
  }
}



export const getUserByUserAuthId = async (userAuthId) => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('uid', '==', userAuthId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
      const userData = querySnapshot.docs[0].data();
      const userId = querySnapshot.docs[0].id;
      return { userData, userId };
    } else {
      console.log('No matching document found');
    }
  } catch (error) {
    console.error('Error getting user by userAuthId:', error);
  }
};


export const updateUser = async (userid, updatedField) => {
  try {
    const userCollectionRef = collection(db, 'users');
    const userRef = doc(userCollectionRef, userid);
    await updateDoc(userRef, updatedField);
    console.log(`User with userid ${userid} updated in Firestore.`)
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

export async function LogOut(){
  try{
    await auth.signOut();
  }catch(error){
    logError(error)
  }
}

function logError(err) {
  console.log(err);
}
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
  getDoc
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
  try {
    const wishRef = collection(db, 'wishlist');
    const docRef = await addDoc(wishRef, wishData);
    const documentId = docRef.id;
    return documentId;
  } catch (error) {
    logError(error);
  }
}

/*
export const removeWishItemToFireStore = async (userCid, trailTitle) => {
  try{

  }
}
*/

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
    const userRef = doc(userCollectionRef, userid)
    await updateDoc(userRef, updatedField);
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
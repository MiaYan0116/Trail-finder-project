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
  getDocs
} from "@firebase/firestore";
import { db } from "./firebaseSetup";



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


function logError(err) {
  console.log(err);
}

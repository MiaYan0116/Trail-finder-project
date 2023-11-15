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
} from "@firebase/firestore";
import { db } from "./firebaseSetup";


export async function addInitialDataToFirestore(data) {
  try {
    const trailsRef = collection(db, 'traillist');
    const existingTrail = await trailsRef.doc(data.trailTitle).get();
    if (!existingTrail.exists) {
      await addDoc(collection(db, "traillist"), data);
    }
  } catch (err) {
    logError(err);
  }
}


function logError(err) {
  console.log(err);
}

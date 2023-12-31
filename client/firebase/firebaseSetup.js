import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: apiKey, 
  authDomain: authDomain, 
  projectId: projectId, 
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId
};



// Initialize Firebase
const myApp = initializeApp(firebaseConfig);
export const db = getFirestore(myApp);
export const auth = initializeAuth(myApp, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const storage = getStorage(myApp);


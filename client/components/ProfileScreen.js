//The ProfileScreen displays the profile page, and enables a user to upload an avatar image or edit the description and username.

import React, { useState, useEffect } from 'react'
import { Pressable, Image, TextInput, StyleSheet, View, Text, Button } from 'react-native'
import { db, auth } from '../firebase/firebaseSetup';
import { container } from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome';
import { LogOut, getUserByUserAuthId, updateUser } from '../firebase/firestore';
import ImageManager from './ImageManager';
import { storage } from '../firebase/firebaseSetup';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import colors from "../helper/colors";
import paddings from '../helper/paddings';
import fontSizes from "../helper/fontSizes";


const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [userCid, setUserCid] = useState('');
  const [userImageUri, setUserImageUri] = useState('https://assets.stickpng.com/images/5a9fbf489fc609199d0ff158.png');

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser) {
          const { userData, userId } = await getUserByUserAuthId(auth.currentUser.uid);
          setUser(userData || {});
          setDescription(userData.description || '');
          setUsername(userData.username || '');
          setUserCid(userId || '');
          setUserImageUri(userData.avatarUri || 'https://assets.stickpng.com/images/5a9fbf489fc609199d0ff158.png');
        }else{
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);


  const usernameChangeHandler = (username) => {
    setUsername(username);
  }
  const descriptionChangeHandler = (description) => {
    setDescription(description);
  }

  async function uploadImageToStorage() {
    if(userImageUri === 'https://assets.stickpng.com/images/5a9fbf489fc609199d0ff158.png') {
      return userImageUri; // Return the current URI if no new image has been uploaded
    }
    try {
      if(userImageUri === 'https://assets.stickpng.com/images/5a9fbf489fc609199d0ff158.png') return;
      const response = await fetch(userImageUri);
      const imageBlob = await response.blob();
      const imageName = userImageUri.substring(userImageUri.lastIndexOf("/") + 1);
      const imageRef = ref(storage, `images/${imageName}`);
      await uploadBytesResumable(imageRef, imageBlob);
      const downloadUri = await getDownloadURL(imageRef);
      console.log("Downloaded URI@: ", downloadUri);
      return downloadUri;
    } catch (err) {
      console.log("error in uploading: ",err);
    }
  }

  const saveHandler = async () => {
    const downloadedUri = await uploadImageToStorage();
    console.log("avatar: ", downloadedUri);
    setUserImageUri(downloadedUri);
    const updatedField = {
      username: username,
      description: description,
      avatarUri: downloadedUri,
    }
    await updateUser(userCid, updatedField);
    
    console.log("userUpdated", updatedField);
  }

  const LogOutHandler = () => {
    LogOut();
    navigation.replace('Login');
  }
  const loginHandler = () => {
    navigation.navigate('Login');
  }
  
  const wishListHandler = () => {
    navigation.navigate('Wishlist', {userCid});
  }
  
  return (
    <View style={container}>
      {auth.currentUser && <View>
        <View style={styles.avatarContainer}>
          <Image 
            source={{uri: userImageUri}}
            style={styles.avatar}
          />
          <ImageManager setPassImageUri={setUserImageUri}/>
        </View>
        <View style={{marginVertical: 25, alignItems: 'center'}}>
          <TextInput 
            style={styles.usernameInput}
            value={username}
            onChangeText={usernameChangeHandler}
          />
        </View>
        <View style={styles.infoContainer}>
          <Icon name="envelope" size={20} color="#777" style={styles.icon} />
          <Text style={{fontSize: fontSizes.small}}>{user.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="pencil" size={20} color="#777" style={styles.icon} />
          <TextInput 
            style={styles.descriptionInput}
            value={description}
            onChangeText={descriptionChangeHandler}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Button title="Save" onPress={saveHandler} />
          </View>
          <View style={{ marginLeft: 5 }}>
            <Button title="Log out" onPress={LogOutHandler} />
          </View>
          <View style={{ marginLeft: 5 }}>
            <Button title="Wishlist" onPress={wishListHandler} />
          </View>
        </View>
      </View>}
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderRadius: 100
  },
  avatarContainer: {
    position: 'relative',
    marginLeft: 30
  },
  
  usernameInput:{
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: colors.themeBackgroundColor,
    borderColor: colors.themeBackgroundColor,
    borderBottomWidth: 1,
    padding: paddings.extremesmall,
  },
  infoContainer:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 40,
    marginVertical: 10
  },
  label:{
    marginRight: 10
  },
  icon: { 
    marginRight: 10, 
    color: colors.themeBackgroundColor 
  },
  descriptionInput:{
    fontSize: fontSizes.small,
    width: 130,
    borderColor: colors.themeBackgroundColor,
    borderBottomWidth: 1,
    padding: paddings.extremesmall,
  }
})

export default ProfileScreen
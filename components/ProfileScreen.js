import React, { useState, useEffect } from 'react'
import { Pressable, Image, TextInput, StyleSheet, View, Text, Button } from 'react-native'
import { db, auth } from '../firebase/firebaseSetup';
import { container, themeBackgroundColor } from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome';
import { LogOut, getUserByUserAuthId, updateUser } from '../firebase/firestore';
import ImageManager from './ImageManager';
import { storage } from '../firebase/firebaseSetup';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


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
          <Text style={{fontSize: 18}}>{user.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="pencil" size={20} color="#777" style={styles.icon} />
          <TextInput 
            style={styles.descriptionInput}
            value={description}
            onChangeText={descriptionChangeHandler}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button title="Save" onPress={saveHandler}/>
          <Button title="Log out" onPress={LogOutHandler}/>
          <Button title="Wishlist" onPress={wishListHandler}/>
        </View>
      </View>}
      {!auth.currentUser && <Button title="Login" onPress={loginHandler}/>}
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
    fontSize: 30,
    fontWeight: 'bold',
    color: themeBackgroundColor,
    borderColor: themeBackgroundColor,
    borderBottomWidth: 1,
    padding: 5,
  },
  infoContainer:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10
  },
  label:{
    marginRight: 10
  },
  icon: { 
    marginRight: 10, 
    color: themeBackgroundColor 
  },
  descriptionInput:{
    fontSize: 18,
    width: 130,
    borderColor: themeBackgroundColor,
    borderBottomWidth: 1,
    padding: 5,
  }
})

export default ProfileScreen
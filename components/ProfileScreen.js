import React, { useState, useEffect } from 'react'
import { Pressable, Image, TextInput, StyleSheet, View, Text, Button } from 'react-native'
import { db, auth } from '../firebase/firebaseSetup';
import { container, themeBackgroundColor } from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome';
import { LogOut, getUserByUserAuthId, updateUser } from '../firebase/firestore';
import ImageManager, { openCamera } from './ImageManager';

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

  const saveHandler = async () => {
    const updatedField = {
      username: username,
      description: description,
      avatarUri: userImageUri,
    }
    await updateUser(userCid, updatedField);
    console.log(updatedField);
  }
  const LogOutHandler = () => {
    LogOut();
    navigation.replace('Login');
  }
  const loginHandler = () => {
    navigation.navigate('Login');
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
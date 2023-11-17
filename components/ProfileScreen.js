import React, { useState, useEffect } from 'react'
import { Image, TextInput, StyleSheet, View, Text, Button } from 'react-native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { db, auth } from '../firebase/firebaseSetup';
import { collection, query, where, getDocs } from "@firebase/firestore";
import { container, themeBackgroundColor } from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome';
import { LogOut, getUserByUserAuthId, updateUser } from '../firebase/firestore';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [userCid, setUserCid] = useState('');
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser) {
          const { userData, userId } = await getUserByUserAuthId(auth.currentUser.uid);
          setUser(userData || {});
          setDescription(userData.description || '');
          setUsername(userData.username || '');
          setUserCid(userId || '');
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
        <Image 
          source={{uri: user.avatarUri}}
          style={styles.avatar}
        />
        <View style={{marginVertical: 25, alignItems: 'center'}}>
          <TextInput 
            style={styles.usernameInput}
            value={username}
            onChangeText={usernameChangeHandler}
          />
        </View>
        <View style={styles.infoContainer}>
          <Icon name="envelope" size={20} color="#777" style={styles.icon} />
          <Text style={styles.infoText}>{user.email}</Text>
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
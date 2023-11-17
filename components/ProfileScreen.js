import React, { useState, useEffect } from 'react'
import { Image, TextInput, StyleSheet, View, Text, Button } from 'react-native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { db, auth } from '../firebase/firebaseSetup';
import { collection, query, where, getDocs } from "@firebase/firestore";
import { container, themeBackgroundColor } from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome';


const ProfileScreen = ({ navigation }) => {
  console.log("auth", auth.currentUser.uid);
  const [user, setUser] = useState(null);
  let initialDes;
  let initialName;

  if(user){
    initialDes = user.description;
    initialName = user.username
  }else{
    initialDes = ''
    initialName = ''
  }
  const [description, setDescription] = useState(initialDes);
  const [username, setUsername] = useState(initialName);
  console.log("user:", user);


  useEffect(() => {
    const getUserData = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('uid', '==', auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
  
        // Check if the document exists
        if (querySnapshot.size > 0) {
          // Assuming there is only one document with the given UID
          const userData = querySnapshot.docs[0].data();
          setUser(userData);
        } else {
          // Handle the case where no matching document is found
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting user data:', error);
        // Handle the error as needed
      }
    };
  
    // Call the function to get user data when the component mounts
    getUserData();
  }, []);
  
    
  const usernameChangeHandler = (username) => {
    setUsername(username);
  }

  const descriptionChangeHandler = (description) => {
    setDescription(description);
  }

  const saveHandler = () => {
    const updatedUser = {
      username: username,
      description: description,
      email: user.email,
      uid: user.uid
    }
    console.log(updatedUser);
  }

  const loginHandler = () => {
		navigation.navigate('Login');
	}

  return (
    <View style={container}>
      {user && <View>
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
        <Button title="Save" onPress={saveHandler}/>
      </View>}
      {!user && <Button title="Login" onPress={loginHandler}/>}
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
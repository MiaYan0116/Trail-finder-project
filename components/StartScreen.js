import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ImageBackground } from 'react-native'
import { SingleButton } from './SingleButton'
import { backGroundImage } from '../styles';
import { addInitialDataToFirestore } from "../firebase/firestore";
import data from './traillist.json';

const StartScreen = ({ navigation }) => {
    
    useEffect(() => {
      for(let i = 0; i < data.length; i++) {
        addInitialDataToFirestore(data[i]);
      }
    }, []);

    const startHandler = async() => {
      navigation.replace("TabNavigation");
      
    }

  return (
    <ImageBackground
      source={require('../assets/start_image.jpg')}
      style={backGroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Trail Finder</Text>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Discover and explore the best trails in the Great Vancouver Area!</Text>
        </View>
        <View style={styles.buttonContainer}>
          <SingleButton text={'START'} handlefunc={startHandler}/>
        </View>
        
      </View>
    </ImageBackground>
  )
}
const styles = StyleSheet.create({
   
  container: {
    backgroundColor: 'rgba(255,255,255,0)', 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    color: '#FFFFF0',
    fontWeight: 'bold'
  },
  welcomeContainer: {
    marginTop: 30,
    marginHorizontal: 50,
  },
  welcomeText: {
    fontSize: 22,
    color: '#FFFFF0',
    fontWeight: 'bold'
  },
  buttonContainer:{
    marginTop: 40
  }
});
export default StartScreen
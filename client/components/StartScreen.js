import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, Text, ImageBackground } from 'react-native'
import { SingleButton } from './SingleButton'
import { backGroundImage } from '../styles';
import { addInitialDataToFirestore } from "../firebase/firestore";
import data from './traillist.json';
import { imageAPIKey, mapAPIKey } from '@env';
import { Animated } from 'react-native';

  
async function fetchTrailGeo(name) {
  const apiKey = mapAPIKey;
  const trailName = name;
  try {
    const res = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(trailName)}&inputtype=textquery&key=${apiKey}&fields=name,geometry`);
    const data = await res.json();
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].geometry) {
      const geo = data.candidates[0].geometry.location;
      return geo;
    } else {
      return null; 
    }
  } catch (error) {
    console.error('Error fetching Place Search API:', error);
  }
}


  // We are not using External API at this moment
  async function fetchImageUri(trailTitle) {
    try{
      const response = await fetch(`https://api.bing.microsoft.com/v7.0/images/search?q=${trailTitle}`, {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': '8f17ea6d1c9a427aa26d4ff9cbe799b6',
        },
      });
      // console.log(response.status);
      const data = await response.json();
      const uri = data.value[0].contentUrl;
      // console.log(uri);
      return uri;
    }catch(err){
      console.log(err);
    }
    
  }; 

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const StartScreen = ({ navigation }) => {
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(200)).current;

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1, // Final value of opacity: 1
        duration: 1000, // Animation duration
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    }, [fadeAnim]);
    useEffect(() => {
      Animated.timing(slideAnim, {
        toValue: 0, // Final value for Y-axis: 0
        duration: 1000, // Animation duration
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    }, [slideAnim]);
    
    useEffect(() => {
      const addInitialData = async (batchSize) => {
        try {

          const totalBatches = Math.ceil(data.length / batchSize);
          const updatedData = [];

          for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            const startIndex = batchIndex * batchSize;
            const endIndex = Math.min((batchIndex + 1) * batchSize, data.length);
            const batchItems = data.slice(startIndex, endIndex);

            const batchResults = await Promise.all(batchItems.map(async (item, index) => {
              const retries = 10;
              for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                  // if (item.imageUri) {
                    item.imageUri = await fetchImageUri(item.trailTitle);
                  // }
                  // Call fetchTrailGeo and add the geo property to the item
                  const geoData = await fetchTrailGeo(item.trailTitle);
                  item.geo = geoData; 
                  break;
                } catch (err) {
                  console.error(`Error fetching image URI for item ${index}, attempt ${attempt}:`, err);
                  if (attempt < retries) {
                    // Retry with a delay (exponential backoff)
                    await delay(2 ** attempt * 1000);
                  } else {
                    throw err; // Throw the error if retries are exhausted
                  }
                }
              }
              return item;
            }));
        
            updatedData.push(...batchResults);
          }

            // console.log(updatedData);
            for(let i = 0; i < updatedData.length; i++) {
              // console.log(data[i]);
              addInitialDataToFirestore(updatedData[i]);
            }
        } catch (error) {
          console.error("Error updating image URIs:", error);
        }
      }
      addInitialData(14);
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
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Trail Finder
      </Animated.Text>
        {/* <Text style={styles.title}>Trail Finder</Text> */}
        <View style={styles.welcomeContainer}>
          <Animated.Text style={[styles.welcomeText, { opacity: fadeAnim }]}>Discover and explore the best trails in the Great Vancouver Area!</Animated.Text>
        </View>
        <Animated.View style={[styles.buttonContainer, { transform: [{ translateY: slideAnim }] }]}>
          <SingleButton text={'START'} handlefunc={startHandler}/>
        </Animated.View>

        
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
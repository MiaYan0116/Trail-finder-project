import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ImageBackground } from 'react-native'
import { SingleButton } from './SingleButton'
import { backGroundImage } from '../styles';
import { addInitialDataToFirestore } from "../firebase/firestore";
import data from './traillist.json';


  /** We are not using External API at this moment
  async function fetchImageUri(item) {
    const response = await fetch(`https://api.bing.microsoft.com/v7.0/images/search?q=${item.trailTitle}`, {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': '8f17ea6d1c9a427aa26d4ff9cbe799b6',
        },
    });
    const data = await response.json();
    const uri = data.value[0].contentUrl;
    console.log(uri);
    return uri;
  }; 

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  */

  const StartScreen = ({ navigation }) => {
    
    /** We are not using External API at this moment
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
                  if (item.imageUri) {
                    item.imageUri = await fetchImageUri(item);
                  }
                  
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

            console.log(updatedData);
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
    */

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
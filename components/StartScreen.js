import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'


const StartScreen = ({ navigation }) => {
  const startHandler = () => {
		navigation.replace("TabNavigation")
	}

  return (
    <View style={styles.container}>
      <Text>Start page</Text>
      <Button title="Start" onPress={startHandler}/>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});
export default StartScreen
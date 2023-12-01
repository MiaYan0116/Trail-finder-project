import React from 'react'
import { Text, View, StyleSheet, Pressable } from 'react-native'
import {themeBackgroundColor, buttonborderRadius, themeTintColor, buttonFontSize, buttonInactiveColor } from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome';

export const SingleButton = (props) => {
  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? buttonInactiveColor : themeBackgroundColor,
            borderRadius: buttonborderRadius,
            margin: 20,
            padding: 10,
            width: 150,
          },
          styles.button,
        ]}
        onPress={props.handlefunc}
      >
        {({ pressed }) => (
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            {props.iconName && <Icon name={props.iconName} size={16} color={themeTintColor} style={{marginRight: 9}}/>}
            <Text 
              style={[styles.buttonText, 
              { color: pressed ? buttonInactiveColor : themeTintColor }]}
            >
              {props.text}
            </Text>
          </View>
          
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: themeBackgroundColor, 
		borderRadius: buttonborderRadius,
		width: 150
	},
	buttonText: {
		color: themeTintColor,
		fontSize: buttonFontSize,
		fontWeight: 'bold',
		textAlign: 'center',
	}
})
export default SingleButton;
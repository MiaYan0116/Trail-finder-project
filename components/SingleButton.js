import React from 'react'
import { Text, View, StyleSheet, Pressable } from 'react-native'
import {themeBackgroundColor, buttonborderRadius, themeTintColor, buttonFontSize, buttonInactiveColor } from '../styles'

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
          <Text 
						style={[styles.buttonText, 
						{ color: pressed ? buttonInactiveColor : themeTintColor }]}
					>
            {props.text}
          </Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: themeBackgroundColor, 
		borderRadius: buttonborderRadius,
		margin: 20,
		padding: 10,
		width: 150
	},
	buttonText: {
		color: themeTintColor,
		fontSize: buttonFontSize,
		fontWeight: 'bold',
		textAlign: 'center',
	}
})
export default SingleButton
// App file
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigation from './components/TabNavigation';
import StartScreen from './components/StartScreen';
import { iconSize, themeBackgroundColor, themeTintColor, buttonActiveColor, buttonInactiveColor } from './styles';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: {
            backgroundColor: themeBackgroundColor
          },
          headerTintColor: themeTintColor,
        }}
      >
      <Stack.Screen 
          name='Start Screen' 
          component={StartScreen}
          options={{ headerShown: false }}
      />
      <Stack.Screen 
          name='TabNavigation' 
          component={TabNavigation}
          options={{ headerShown: false }}
      />
      </Stack.Navigator> 
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

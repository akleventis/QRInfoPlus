import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/scenes/home';
import Login from './src/scenes/auth'
import Scan from './src/scenes/scan';
import Info from './src/scenes/info';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={Login}
        />
        <Stack.Screen
          name="Scan"
          component={Scan}
        />
        <Stack.Screen
          name="Info"
          options={{ headerShown: false }}
          component={Info}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
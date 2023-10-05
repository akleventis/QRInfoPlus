import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/store'
import { Provider } from 'react-redux'
import Home from './src/scenes/home';
import Login from './src/scenes/auth'
import Scan from './src/scenes/scan';
import Info from './src/scenes/info';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerTintColor: 'white',
              headerStyle: {
                backgroundColor: '#172e41',
              }
            }}
          />
          <Stack.Screen
            name="Login"
            options={{ 
              headerShown: false 
            }}
            component={Login}
          />
          <Stack.Screen
            name="Scan"
            component={Scan}
            options={{
              headerTintColor: 'white',
              headerStyle: {
                backgroundColor: '#172e41',
              }
            }}
          />
          <Stack.Screen
            name="Info"
            component={Info}
            options={{
              headerTintColor: 'white',
              headerStyle: {
                backgroundColor: '#172e41',
              }
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider >
  );
}
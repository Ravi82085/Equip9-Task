
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UploadProfilePicScreen from './src/UploadProfilePicScreen';
import CalculateDistanceScreen1 from './src/CalculateDistanceScreen1';
import CalculateDistanceScreen2 from './src/CalculateDistanceScreen2';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UploadProfilePic">
        <Stack.Screen name="Upload Profile" component={UploadProfilePicScreen} />
        <Stack.Screen name="CalculateDistanceScreen1" component={CalculateDistanceScreen1} />
        <Stack.Screen name="CalculateDistanceScreen2" component={CalculateDistanceScreen2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


import React from 'react';
import MainNavigation from './src/navigation/MainNavigation'
import { NavigationContainer } from "@react-navigation/native";
import {Provider} from './src/context/Context'

export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </Provider>
  );
}



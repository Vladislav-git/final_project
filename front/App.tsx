import React from 'react';
import MainNavigation from './src/navigation/MainNavigation'
import { NavigationContainer } from "@react-navigation/native";
import {Provider} from './src/context/Context'
import firebase from 'firebase';
import { ApolloProvider, ApolloClient, InMemoryCache, gql } from '@apollo/client';

const firebaseConfig = {
  apiKey: "AIzaSyBksvVdQmzeHeImOnzgLRKrLiOmqDmvUvQ",
  authDomain: "test-e8526.firebaseapp.com",
  projectId: "test-e8526",
  storageBucket: "test-e8526.appspot.com",
  messagingSenderId: "7827040613",
  appId: "1:7827040613:web:a1f42a97f325c89eb1998c",
  measurementId: "G-1MBQHYH2Y9"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}

const client = new ApolloClient({
  uri: 'http://192.168.31.181:8000/graphql',
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>  
      <Provider>
        <NavigationContainer>
          <MainNavigation />
        </NavigationContainer>
      </Provider>
    </ApolloProvider>
  );
}



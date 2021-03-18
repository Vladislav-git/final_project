import React from 'react';
import {Text, TouchableOpacity, TextInput, View, StyleSheet, Dimensions, Button} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../components/Login'
import Register from '../components/Register'
import Messages from '../components/Messages'
import Comments from '../components/Comments'
import UserProfile from '../components/UserProfile'
import {useC, useUpdateC} from '../context/Context'
import TabNavigation from './TabNavigation'


const Stack = createStackNavigator();

const MainNavigation = () => {

    const {darkTheme}:any = useC();
    const {toggleTheme}:any = useUpdateC();

    const options = {
        headerStyle: {
            borderBottomColor: darkTheme ? 'grey' : 'black',
            backgroundColor: darkTheme ? 'black' : 'white',
            borderBottomWidth: 1,
        },
        headerTintColor: darkTheme ? 'white' : 'black',
        headerRight: () => (
            <Button
              onPress={() => toggleTheme()}
              title="Theme"
              color="black"
            />
        ),
    }

    return (
        <Stack.Navigator>
            <Stack.Screen name='Login' options={options} component={Login}/>
            <Stack.Screen name='Register' options={options} component={Register}/>
            <Stack.Screen name='Profile' options={options} component={TabNavigation}/>
            <Stack.Screen name='Messages' options={options} component={Messages}/>
            <Stack.Screen name='Comments' options={options} component={Comments}/>
            <Stack.Screen name='UserProfile' options={options} component={UserProfile}/>
        </Stack.Navigator>
    )
}

export default MainNavigation;
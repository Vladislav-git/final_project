import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../components/Login'
import Register from '../components/Register'
import Profile from '../components/Profile'
import {useC, useUpdateC} from '../context/Context'

const Stack = createStackNavigator();

const MainNavigation = () => {

    const {darkTheme}:any = useC();

    const options = {
        headerStyle: {
            borderColor: 'gray',
            backgroundColor: darkTheme ? '#06103d' : '#327ba8',
        },
        headerTintColor: 'white',
    }

    return (
        <Stack.Navigator>
            <Stack.Screen name='Login' options={options} component={Login}/>
            <Stack.Screen name='Register' options={options} component={Register}/>
            <Stack.Screen name='Profile' options={options} component={Profile} />
        </Stack.Navigator>
    )
}

export default MainNavigation;
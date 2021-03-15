import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../components/Login'
import Register from '../components/Register'
import Messages from '../components/Messages'
import Comments from '../components/Comments'
import {useC} from '../context/Context'
import TabNavigation from './TabNavigation'


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
            <Stack.Screen name='Profile' options={options} component={TabNavigation}/>
            <Stack.Screen name='Messages' options={options} component={Messages}/>
            <Stack.Screen name='Comments' options={options} component={Comments}/>
        </Stack.Navigator>
    )
}

export default MainNavigation;
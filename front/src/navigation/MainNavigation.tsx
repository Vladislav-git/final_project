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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


const Stack = createStackNavigator();

const MainNavigation = () => {

    const {darkTheme, context}:any = useC();
    const {toggleTheme, updateData}:any = useUpdateC();

    const options = {
        headerStyle: {
            borderBottomColor: darkTheme ? 'grey' : 'black',
            backgroundColor: darkTheme ? 'black' : 'white',
            borderBottomWidth: 1,
        },
        headerTintColor: darkTheme ? 'white' : 'black',
        headerRight: () => (
            <View style={{flexDirection: 'row', justifyContent: 'space-around', width: 70}}>
                <TouchableOpacity onPress={() => toggleTheme()}>
                    {darkTheme
                        ? <MaterialCommunityIcons
                        style={{alignSelf: 'flex-end'}}
                        name="white-balance-sunny"
                        color={'white'}
                        size={26}
                        />
                        : <MaterialCommunityIcons
                        style={{alignSelf: 'flex-end'}}
                        name="moon-waxing-crescent"
                        color={'black'}
                        size={26}
                        />
                    }
                    
                </TouchableOpacity>
                {context.token
                    ? <TouchableOpacity onPress={() => {
                        updateData({...context, token: ''})
                    }}>
                        <MaterialCommunityIcons
                        style={{alignSelf: 'flex-end'}}
                        name="logout"
                        color={darkTheme ? 'white' : 'black'}
                        size={26}
                        />
                    </TouchableOpacity>
                    : null
                }
                
            </View>
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
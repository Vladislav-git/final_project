import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {useC} from '../context/Context'
import Profile from '../components/Profile'
import News from '../components/News'
import Messages from '../components/Messages'
import Friends from '../components/Friends'
import ChatList from '../components/ChatList'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Tab = createMaterialBottomTabNavigator();

const TabNavigation = () => {
    
    const {darkTheme}:any = useC();

    return (
        <Tab.Navigator
        activeColor={darkTheme ? "white" : '#327ba8'}
        inactiveColor={darkTheme ? '#a69a9b' : 'grey'}
        barStyle={{ backgroundColor: darkTheme ? '#1f1f1f' : 'white' }}
        shifting={false}
        >
            <Tab.Screen name='News' component={News} options={{
                tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="newspaper" color={color} size={26} />),
            }}
            />
            <Tab.Screen name='Friends' component={Friends}options={{
                tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="account-multiple" color={color} size={26} />),
            }}
            />
            <Tab.Screen name='ChatList' component={ChatList}options={{
                tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="message" color={color} size={26} />),
                tabBarLabel: 'Messages'
            }}
            />
            <Tab.Screen name='Profile' component={Profile} options={{
                tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="account" color={color} size={26} />),
            }}
            />
        </Tab.Navigator>
    );
}

export default TabNavigation
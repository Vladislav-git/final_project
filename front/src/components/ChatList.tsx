import React, { useEffect, useState } from 'react'
import {Text, TouchableOpacity, Modal, ScrollView, View, Image, TextInput} from 'react-native'
import axios from 'axios';
import {useC, useUpdateC} from '../context/Context'


const ChatList = ({navigation}:any) => {
    
    const {darkTheme, data}:any = useC();
    const {updateData}:any = useUpdateC();

    const [chatUsersInfo, setChatUsersInfo] = useState([])

    useEffect(() => {
        (async () => {
            axios('http://10.0.2.2:8000/get-chats',{
                method: 'get',
                headers: {Authorization: 'Bearer ' + data.token},
            })
                .then((respchats:any) => {
                    updateData({...data, current_chat: respchats.data.chats})
                    setChatUsersInfo(respchats.data.chatUsersInfo)
                })
                .catch(err => {
                    alert(err)
                    navigation.navigate('Login')
                })
        })()
    }, [])

    const addChat = async () => {
        axios('http://10.0.2.2:8000/add-chat',{
            method: 'post',
            headers: {Authorization: 'Bearer ' + data.token},
            data: {body:'vlad@mail.ru'}
        })
            .then(resp => console.log(resp.data))
            .catch(err => alert(err.message))
    }

    return (
        <ScrollView>
            <TextInput />
            <TouchableOpacity onPress={() => addChat()}>
                <Text>Add chat</Text>
            </TouchableOpacity>
            {(chatUsersInfo[0] !== undefined)
                ? chatUsersInfo.map((chat:any, index) => (
                    <View key={index} style={{width: '100%', height: 70, borderWidth: 1}}>
                        <TouchableOpacity style={{flexDirection: 'row', height: '100%'}} onPress={() => {
                            updateData({...data}, chat)
                            navigation.navigate('Messages')
                        }}>
                            <Image
                            source={(chat.avatar !== '')
                                ? {uri: chat.avatar}
                                : require('../../assets/default_user.png')
                            }
                            style={{width: '15%', height: '90%', borderRadius: 10}}
                            />
                            <Text style={{alignSelf: 'center', borderWidth: 1}}>{chat.firstname} {chat.secondname}</Text>
                        </TouchableOpacity>
                    </View>
                ))
                : null
            }
        </ScrollView>
        

        
    )
    
}

export default ChatList;
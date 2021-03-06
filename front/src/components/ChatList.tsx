import React, { useEffect, useState } from 'react'
import {Text, TouchableOpacity, Modal, ScrollView, View, Image, TextInput, StyleSheet} from 'react-native'
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
            data: {chat_user:'vlad@mail.ru'}
        })
            .then(resp => console.log(resp.data))
            .catch(err => alert(err.message))
    }

    console.log(chatUsersInfo)

    return (
        <ScrollView>
            <TouchableOpacity style={styles.Button} onPress={() => addChat()}>
                <Text>Add chat</Text>
            </TouchableOpacity>
            <TextInput
            placeholder='Search chat'
            style={styles.Input}
            />
            {(chatUsersInfo[0] !== undefined)
                ? chatUsersInfo.map((chat:any, index) => (
                    <View key={index} style={styles.ChatListBox}>
                        <TouchableOpacity
                        style={styles.ChatBox}
                        activeOpacity={1}
                        onPress={() => {
                            updateData({...data}, chat)
                            navigation.navigate('Messages')
                        }}
                        >
                            <Image
                            source={(chat.avatar !== null && chat.avatar !== '')
                                ? {uri: chat.avatar}
                                : require('../../assets/default_user.png')
                            }
                            style={styles.Image}
                            />
                            <Text style={styles.Text}>{chat.firstname} {chat.secondname}</Text>
                        </TouchableOpacity>
                    </View>
                ))
                : null
            }
        </ScrollView>
        

        
    )
    
}

const styles = StyleSheet.create({
    ChatListBox: {
        width: '100%',
        height: 70,
        marginTop: '3%'
        // borderWidth: 1
    },
    ChatBox: {
        flexDirection: 'row',
        height: '100%'
    },
    Image: {
        width: '15%',
        height: '90%',
        borderRadius: 10,
        marginLeft: '2%'
    },
    Text: {
        alignSelf: 'flex-start',
        fontSize: 16,
        // borderWidth: 1,
        marginLeft: '2%',
        marginTop: '1%'
    },
    Input: {
        marginTop: '2%',
        height: '35%',
        width: '80%',
        marginLeft: '10%',
        borderWidth: 1,
        borderRadius: 5
    },
    Button: {
        marginTop: '2%',
        height: '30%',
        width: '20%',
        backgroundColor: 'green',
        alignSelf: 'center'
    }
})

export default ChatList;
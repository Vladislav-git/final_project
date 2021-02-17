import React, { useEffect, useState } from 'react'
import {Text, TextInput, View, TouchableOpacity, ScrollView, Image, StyleSheet} from 'react-native'
import {io} from 'socket.io-client'
import {useC, useUpdateC} from '../context/Context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Messages = () => {

    const {darkTheme, data}:any = useC();
    const {updateData}:any = useUpdateC();

    const [allChats, setAllChats] = useState([])
    const [chatUserInfo, setChatUserInfo]:any = useState([])
    const [message, setMessage] = useState('')

    useEffect(() => {
        (() => {
            socket.emit('get-messages', {chat_id: data.current_chat[0]._id, user_id: data.user._id, chat_user: data.current_chat[0].user_id})
            socket.on('get-messages', (msg:any) => {
                setAllChats(msg.allChats)
                setChatUserInfo(msg.chatUserInfo)
            })
        })()
    },[])

    const socket = io('http://192.168.56.1:8000')

    const sendMessage = () => {
        socket.emit('msg', {message, current_chat: data.current_chat, id: data.user._id})
        setMessage('')
    }

    console.log(allChats)

    return (
        <View>
            <View style={styles.ChatUser}>
                <Image
                source={(chatUserInfo.avatar !== '')
                ? {uri: chatUserInfo.avatar}
                : require('../../assets/default_user.png')
                }
                style={styles.Image}
                />
                <Text style={styles.Text}>{chatUserInfo.firstname} {chatUserInfo.secondname}</Text>
            </View>
            <ScrollView style={styles.Messages}>
                {(allChats[0] !== undefined)
                    ? allChats.map((userMessage:any, index) => (
                        <View key={index} style={styles.MessageTextBox}>
                            <Text style={styles.MessageText}>{userMessage.message_text}</Text>
                        </View>
                    ))
                    : null
                }
            </ScrollView>
            <View style={styles.Box}>
                <TextInput
                style={styles.Input}
                placeholder='Message'
                value={message}
                onChangeText={(messageText) => setMessage(messageText)}
                />
                <TouchableOpacity style={styles.Button} onPress={() => sendMessage()}>
                    <MaterialCommunityIcons style={{alignSelf: 'center'}} name="send" color={'lightblue'} size={26} />
                </TouchableOpacity>
            </View>
            
        </View>
        
        
    )
    
}

const styles = StyleSheet.create({
    Image: {
        width: '1%',
        height: '90%',
        borderRadius: 50,
        marginLeft: '35%'
    },
    ChatUser: {
        width: '100%',
        height: '7%',
        borderWidth: 1,
        marginTop: '2%',
        flexDirection: 'row',
    },
    Text: {
        fontSize: 16
    },
    Input: {
        height: '70%',
        width: '80%',
        borderRadius: 5,
        borderWidth: 1,
        marginLeft: '5%',
        marginTop: '2%'
    },
    Box: {
        flexDirection: 'row',
        height: '10%',
        width: '100%',
        marginTop: '1%',
        borderWidth: 1
    },
    Button: {
        marginLeft: '2%',
        height: '70%',
        width: '10%',
        borderWidth: 1,
        marginTop: '2%',
        justifyContent: 'center'
    },
    Messages: {
        height: '80%',
        borderWidth: 1,
        marginTop: '1%'
    },
    MessageTextBox: {
        
    },
    MessageText: {
        borderWidth: 1,
        minWidth: '30%',
        maxWidth: '50%',
        borderRadius: 10,
        textAlign: 'auto',
        marginLeft: '2%',
        marginTop: '1%'
    }
})

export default Messages;
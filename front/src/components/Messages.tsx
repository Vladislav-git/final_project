import React, { useEffect, useState } from 'react'
import {Text, TextInput, View, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions} from 'react-native'
import {io} from 'socket.io-client'
import {useC, useUpdateC} from '../context/Context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Messages = () => {

    const {darkTheme, data}:any = useC();
    const {updateData}:any = useUpdateC();

    const [allMessages, setAllMessages] = useState([])
    const [chatUserInfo, setChatUserInfo]:any = useState([])
    const [message, setMessage] = useState('')

    const info = {
        chat_id: data.current_chat[0]._id,
        user_id: data.user._id,
        chat_user: (data.user._id === data.current_chat[0].chat_user_id) ? data.current_chat[0].current_user_id : data.current_chat[0].chat_user_id
    }

    useEffect(() => {
        (async() => {
            socket.emit('get-messages', info)
            socket.on('get-messages', (msg:any) => {
                setAllMessages(msg.allMessages)
                setChatUserInfo(msg.chatUserInfo)
            })
        })()
    },[])

    const socket = io('http://192.168.31.181:8000')

    const sendMessage = () => {
        socket.emit('msg', {message, current_chat: data.current_chat, id: data.user._id})
        setMessage('')
    }

    return (
        <View style={{height: Dimensions.get('screen').height-130,}}>
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
                {(allMessages.length !== 0)
                    ? allMessages.map((userMessage:any, index) => (
                        (userMessage.user_id === data.user._id)
                            ? <View key={index} style={styles.MessageTextBox}>
                                <Text style={styles.UserMessageText}>{userMessage.message_text}</Text>
                            </View>
                            : <View key={index} style={styles.MessageTextBox}>
                                <Text style={styles.ChatUserMessageText}>{userMessage.message_text}</Text>
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
    ChatUserMessageText: {
        borderWidth: 1,
        minWidth: '30%',
        maxWidth: '50%',
        borderRadius: 10,
        textAlign: 'auto',
        marginLeft: '2%',
        marginTop: '1%'
    },
    UserMessageText: {
        borderWidth: 1,
        minWidth: '30%',
        maxWidth: '50%',
        borderRadius: 10,
        textAlign: 'auto',
        marginLeft: '50%',
        marginTop: '1%'
    }
})

export default Messages;
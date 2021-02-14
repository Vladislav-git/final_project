import React, { useEffect, useState } from 'react'
import {Text, TextInput, View, TouchableOpacity, ScrollView} from 'react-native'
import {io} from 'socket.io-client'
import {useC, useUpdateC} from '../context/Context'
import axios from 'axios';

const Messages = () => {

    const {darkTheme, data}:any = useC();
    const {updateData}:any = useUpdateC();

    const [chatUserMessages, setChatUserMessages] = useState([])
    const [userMessages, setUserMessages] = useState([])
    const [message, setMessage] = useState('')

    useEffect(() => {
        (async () => {
            socket.emit('get-messages', {chat_id: data.current_chat[0]._id, user_id: data.user._id, chat_user: data.current_chat[0].user_id})
            socket.on('get-messages', (msg:any) => {
                console.log(msg)
            })
        })()
    },[])

    const socket = io('http://192.168.56.1:8000')
    socket.on('message', (message:string) => {
        console.log(message)
    })

    const sendMessage = () => {
        socket.emit('msg', {message, current_chat: data.current_chat, id: data.user._id})
    }

    return (
        <View>
            <ScrollView>

            </ScrollView>
            <TextInput
            placeholder='...'
            value={message}
            onChangeText={(messageText) => setMessage(messageText)}
            />
            <TouchableOpacity onPress={() => sendMessage()}>
                <Text>Send</Text>
            </TouchableOpacity>
        </View>
        
        
    )
    
}

export default Messages;
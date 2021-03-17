import React, { useEffect, useState } from 'react'
import {Text, TextInput, View, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions, Modal} from 'react-native'
import {io} from 'socket.io-client'
import {useC, useUpdateC} from '../context/Context'
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Messages = () => {

    const {darkTheme, data}:any = useC();
    const {updateData}:any = useUpdateC();

    const initialMessage = {
        message_text: '',
        message_img: '',
        message_video: '',
    }

    const [allMessages, setAllMessages] = useState([])
    const [chatUserInfo, setChatUserInfo]:any = useState([])
    const [message, setMessage] = useState(initialMessage)
    const [isVisible, setIsVisible] = useState(false)

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
        setMessage(initialMessage)
    }

    const getPhoto = async () => {
        let result:any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        setMessage({...message, message_img: result.uri})
        setIsVisible(false)
    }

    const getVideo = async () => {
        let result:any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        setMessage({...message, message_video: result.uri})
        setIsVisible(false)
    }

    const Cancel = () => {
        setMessage({...initialMessage, message_text: message.message_text})
        setIsVisible(false)
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
                                {userMessage.message_video === ''
                                    ? null
                                    : <Video source={{uri: userMessage.message_video}} style={{height:120, width: 150, marginLeft: '50%'}} />
                                }
                                {userMessage.message_img === ''
                                    ? null
                                    : <Image source={{uri: userMessage.message_img}} style={{height:120, width: 150, marginLeft: '50%'}} />
                                }
                            </View>
                            : <View key={index} style={styles.MessageTextBox}>
                                <Text style={styles.ChatUserMessageText}>{userMessage.message_text}</Text>
                                {userMessage.message_video === ''
                                    ? null
                                    : <Video source={{uri: userMessage.message_video}} style={{height:120, width: 150}} />
                                }
                                {userMessage.message_img === ''
                                    ? null
                                    : <Image source={{uri: userMessage.message_img}} style={{height:120, width: 150}} />
                                }
                            </View>
                        
                    ))
                    : null
                }
            </ScrollView>
            
            {message.message_video === ''
                ? null
                : <Video source={{uri: message.message_video}} style={{height:50, width: 50}} />
            }
            {message.message_img === ''
                ? null
                : <Image source={{uri: message.message_img}} style={{height:50, width: 50}} />
            }
            
            <View style={styles.Box}>
                <TouchableOpacity style={styles.Button} onPress={() => setIsVisible(true)}>
                    <MaterialCommunityIcons style={{alignSelf: 'center'}} name="paperclip" color={'lightblue'} size={26} />
                </TouchableOpacity>
                <TextInput
                style={styles.Input}
                placeholder='Message'
                value={message.message_text}
                onChangeText={(messageText) => setMessage({...message, message_text: messageText})}
                />
                <TouchableOpacity style={styles.Button} onPress={() => sendMessage()}>
                    <MaterialCommunityIcons style={{alignSelf: 'center'}} name="send" color={'lightblue'} size={26} />
                </TouchableOpacity>
            </View>
            <Modal
            visible={isVisible}
            animationType='slide'
            transparent={true}
            >
                <View style={styles.Modal}>
                    <TouchableOpacity onPress={() => getPhoto()}>
                        <MaterialCommunityIcons style={{alignSelf: 'center'}} name="image" color={'lightblue'} size={26} />
                        <Text>Add Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => getVideo()}>
                        <MaterialCommunityIcons style={{alignSelf: 'center'}} name="video-box" color={'lightblue'} size={26} />
                        <Text>Add Video</Text>
                    </TouchableOpacity>
                    {message.message_video === ''
                        ? null
                        : <Video source={{uri: message.message_video}} />
                    }
                    {message.message_img === ''
                        ? null
                        : <Image source={{uri: message.message_img}} />
                    }
                    <TouchableOpacity style={styles.Button} onPress={() => Cancel()}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            
        </View>
        
        
    )
    
}

const styles = StyleSheet.create({
    Modal: {
        marginTop: '10%',
        height: Dimensions.get('screen').height - 200,
        width: '80%',
        borderWidth: 1,
        borderRadius: 20,
        color: 'grey',
        alignSelf: 'center',
        backgroundColor: 'white',
    },
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
        width: '70%',
        borderRadius: 5,
        borderWidth: 1,
        marginLeft: '2%',
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
        borderWidth: 1
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
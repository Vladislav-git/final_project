import React, { useEffect, useState } from 'react'
import {Text, TextInput, View, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions, Modal, ImageBackground} from 'react-native'
import {io} from 'socket.io-client'
import {useC, useUpdateC} from '../context/Context'
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { StatusBar } from 'expo-status-bar';

const Messages = ({navigation}:any) => {

    const {darkTheme, context}:any = useC();
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
        chat_id: context.current_chat[0]._id,
        user_id: context.user._id,
        chat_user: (context.user._id === context.current_chat[0].chat_user_id) ? context.current_chat[0].current_user_id : context.current_chat[0].chat_user_id
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

    useEffect(() => {
		(() => {
			context.token === '' ? navigation.navigate('Login') : null
		})()
	}, [context.token])

    const socket = io('http://192.168.31.181:8000')

    const sendMessage = () => {
        socket.emit('msg', {message, current_chat: context.current_chat, id: context.user._id})
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
        <View style={{flex: 1, backgroundColor: darkTheme ? 'black' : 'white'}}>
            <StatusBar style={darkTheme ? "light" : 'dark'} />
            <View style={{...styles.ChatUser, backgroundColor: darkTheme ? '#212121' : 'white'}}>
                <Image
                source={(chatUserInfo.avatar !== '')
                ? {uri: chatUserInfo.avatar}
                : require('../../assets/default_user.png')
                }
                style={styles.Image}
                />
                <Text style={{...styles.Text, color: darkTheme ? 'white' : 'black'}}>{chatUserInfo.firstname} {chatUserInfo.secondname}</Text>
            </View>
            <ScrollView style={{...styles.Messages, borderTopColor: darkTheme ? 'grey' : 'black', borderBottomColor: darkTheme ? 'grey' : 'black'}}>
                {(allMessages.length !== 0)
                    ? allMessages.map((userMessage:any, index) => (
                        (userMessage.user_id === context.user._id)
                            ? <View key={index} style={{...styles.MessageTextBox, backgroundColor: darkTheme ? '#787878' : '#b8d3ff'}}>
                                <Text style={{...styles.UserMessageText, color: darkTheme ? 'white' : 'black'}}>{userMessage.message_text}</Text>
                                {userMessage.message_video === ''
                                    ? null
                                    : <Video source={{uri: userMessage.message_video}} style={{height:120, width: '95%', alignSelf: 'center', marginTop: '3%', marginBottom: '3%'}} />
                                }
                                {userMessage.message_img === ''
                                    ? null
                                    : <Image source={{uri: userMessage.message_img}} style={{height:120, width: '95%', alignSelf: 'center', marginTop: '3%', marginBottom: '3%'}} />
                                }
                            </View>
                            : <View key={index} style={{...styles.MessageTextBox, backgroundColor: darkTheme ? '#424242' : 'lightgrey'}}>
                                <Text style={{...styles.ChatUserMessageText, color: darkTheme ? 'white' : 'black'}}>{userMessage.message_text}</Text>
                                {userMessage.message_video === ''
                                    ? null
                                    : <Video source={{uri: userMessage.message_video}} style={{height:120, width: '95%', alignSelf: 'center', marginTop: '3%', marginBottom: '3%'}} />
                                }
                                {userMessage.message_img === ''
                                    ? null
                                    : <Image source={{uri: userMessage.message_img}} style={{height:120, width: '95%', alignSelf: 'center', marginTop: '3%', marginBottom: '3%'}} />
                                }
                            </View>
                        
                    ))
                    : null
                }
            </ScrollView>
            
            {message.message_video === ''
                ? null
                : <View style={{backgroundColor: darkTheme ? '#212121' : 'white', borderBottomWidth: 1, borderBottomColor: darkTheme ? 'black' : 'grey'}}>
                    <Video source={{uri: message.message_video}} style={{height:70, width: 80, marginTop: '2%', marginBottom: '2%', marginLeft: '4%'}} />
                    <TouchableOpacity style={{position: 'absolute', bottom: '65%', left: '20.5%'}} onPress={() => Cancel()}>
                        <MaterialCommunityIcons name="close-circle" color={'grey'} size={20} />
                    </TouchableOpacity>
                </View>
            }
            {message.message_img === ''
                ? null
                : <View style={{backgroundColor: darkTheme ? '#212121' : 'white', borderBottomWidth: 1, borderBottomColor: darkTheme ? 'black' : 'grey'}}>
                    <ImageBackground source={{uri: message.message_img}} style={{height:70, width: 80, marginTop: '2%', marginBottom: '2%', marginLeft: '4%'}}>
                        <TouchableOpacity style={{position: 'absolute', bottom: '68%', left: '74%'}} onPress={() => Cancel()}>
                            <MaterialCommunityIcons name="close-circle" color={'grey'} size={20} />
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            }
            
            <View style={{...styles.Box, backgroundColor: darkTheme ? '#212121' : 'white'}}>
                <TouchableOpacity style={styles.Button} onPress={() => setIsVisible(true)}>
                    <MaterialCommunityIcons style={{alignSelf: 'center'}} name="paperclip" color={'lightgrey'} size={26} />
                </TouchableOpacity>
                <TextInput
                style={{...styles.Input, color: darkTheme ? 'white' : 'black'}}
                placeholder=' Message'
                placeholderTextColor={darkTheme ? 'lightgrey' : 'grey'}
                value={message.message_text}
                onChangeText={(messageText) => setMessage({...message, message_text: messageText})}
                />
                <TouchableOpacity style={styles.Button} onPress={() => sendMessage()}>
                    <MaterialCommunityIcons style={{alignSelf: 'center'}} name="send" color={'#7aadff'} size={26} />
                </TouchableOpacity>
            </View>
            <Modal
            visible={isVisible}
            animationType='none'
            transparent={true}
            onRequestClose={() => Cancel()}
            >
                <View style={{...styles.Modal, backgroundColor: darkTheme ? 'black' : 'white'}}>
                    <View style={{flexDirection: 'row', borderTopWidth:1, borderTopColor: darkTheme ? 'grey' : 'lightgrey'}}>
                        <TouchableOpacity style={{...styles.Button, height: '100%',width: '50%', marginLeft: 0, borderRightWidth: 1, borderRightColor: darkTheme ? 'grey' : 'lightgrey', flexDirection: 'row'}} onPress={() => getPhoto()}>
                            <MaterialCommunityIcons style={{alignSelf: 'center'}} name="image" color={'#7aadff'} size={26} />
                            <Text style={{alignSelf: 'center', color: '#7aadff'}}>Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{...styles.Button, height: '100%',width: '50%', marginLeft: 0, flexDirection: 'row'}} onPress={() => getVideo()}>
                            <MaterialCommunityIcons style={{alignSelf: 'center'}} name="video-box" color={'#7aadff'} size={26} />
                            <Text style={{alignSelf: 'center', color: '#7aadff'}}>Video</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
        </View>
        
        
    )
    
}

const styles = StyleSheet.create({
    Modal: {
        marginTop: Dimensions.get('screen').height*0.73,
        // flex: 1,
        height: 50,
        width: '100%',
        color: 'grey',
        alignSelf: 'center',
        backgroundColor: 'white',
    },
    Image: {
        width: '10%',
        height: '70%',
        borderRadius: 50,
        marginLeft: '35%',
        marginTop: '1%',
        // marginBottom: '1%'
    },
    ChatUser: {
        width: '100%',
        height: '9%',
        flexDirection: 'row',
    },
    Text: {
        fontSize: 16,
        marginLeft: '2%'
    },
    Input: {
        height: '70%',
        width: '70%',
        borderRadius: 5,
        marginLeft: '2%',
        marginTop: '2%'
    },
    Box: {
        flexDirection: 'row',
        height: '10%',
        width: '100%',
    },
    Button: {
        marginLeft: '2%',
        height: 40,
        width: '10%',
        marginTop: '2%',
        justifyContent: 'center',
    },
    Messages: {
        height: '80%',
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    MessageTextBox: {
        flex: 1,
        width: '70%',
        borderRadius: 10,
        alignSelf: 'flex-end',
        marginTop: '2%',
        marginBottom: '2%'
    },
    ChatUserMessageText: {
        textAlign: 'auto',
        marginLeft: '3%',
        marginTop: '2%'
    },
    UserMessageText: {
        textAlign: 'left',
        marginLeft: '3%',
        marginTop: '2%'
    }
})

export default Messages;
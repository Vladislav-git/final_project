import React, { useEffect, useState } from 'react'
import {Text, TouchableOpacity, Modal, ScrollView, View, Image, TextInput, StyleSheet, Dimensions} from 'react-native'
import axios from 'axios';
import {useC, useUpdateC} from '../context/Context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { StatusBar } from 'expo-status-bar';
import { useMutation, useQuery, gql } from '@apollo/client';

const cloneDeep = require('lodash.clonedeep');


const ChatList = ({navigation}:any) => {
    
    const {darkTheme, context} = useC();
    const {updateData}:any = useUpdateC();

    const [chatUsersInfo, setChatUsersInfo]:any = useState([])
    const [isVisible, setIsVisible] = useState(false)
    const [friends, setFriends] = useState([])
    const [chats, setChats] = useState([])

    const getFriends = gql`
        query getFriends($email: String!) {
            getFriends(email: $email) {
                _id
                firstname
                secondname
                email
                password
                created_date,
                profile {
                    gender
                    birth_date
                    city
                    phone_number
                }
                friends
                images
                videos
                avatar
                chats
            }
        }
    `
    const getChats = gql`
        query getChats($email: String!) {
            getChats(email: $email) {
                chatUsersInfo {
                    _id
                    firstname
                    secondname
                    email
                    password
                    created_date
                    profile {
                        gender
                        birth_date
                        city
                        phone_number
                    }
                    friends
                    images
                    videos
                    avatar
                    chats
                }
                chats {
                    _id
                    chat_user_id
                    current_user_id
                }
            }
        }
    `
    const getF = useQuery(getFriends, {variables: {email: context.user.email}})
    const getC = useQuery(getChats, {variables: {email: context.user.email}})

    useEffect(() => {
        if (!getF.loading) {
            const copy = cloneDeep(getF.data.getFriends)
            const newCopy = copy.map((item:any, index:any) => {
                delete item.__typename
                return item
            })
            setFriends(newCopy)
        }
        // (async () => {
        //     axios('http://10.0.2.2:8000/get-chats',{
        //         method: 'get',
        //         headers: {Authorization: 'Bearer ' + context.token},
        //     })
        //         .then((respchats:any) => {
        //             setChats(respchats.data.chats)
        //             setChatUsersInfo(respchats.data.chatUsersInfo)
        //         })
        //         .catch(err => {
        //             alert(err)
        //             // navigation.navigate('Login')
        //         })
        //     axios('http://10.0.2.2:8000/get-friends', {
        //         method: 'get',
        //         headers: {Authorization: 'Bearer ' + context.token},
        //     })
        //         .then(friendsInfoList => {
        //             setFriends(friendsInfoList.data)
        //         })
        //         .catch(err => alert(err))
        // })()
    }, [getF.data])

    useEffect(() => {
        if (!getC.loading) {
            const copy = cloneDeep(getC.data.getChats)
            setChats(copy.chats)
            setChatUsersInfo(copy.chatUsersInfo)
        }
    }, [getC.data])

    useEffect(() => {
		(() => {
			context.token === '' ? navigation.navigate('Login') : null
		})()
	}, [context.token])

    const addChat = async (email:string) => {
        axios('http://10.0.2.2:8000/add-chat',{
            method: 'post',
            headers: {Authorization: 'Bearer ' + context.token},
            data: {chat_user: email}
        })
            .then(resp => {
                if (resp.data.msg === 'new chat created') {
                    updateData({...context, user: resp.data.current_user})
                } else {
                    console.log(resp)
                }
            })
            .catch(err => alert(err.message))
    }

    return (
        <View style={{flex: 1, backgroundColor: darkTheme ? 'black' : 'white'}}>
            <StatusBar style={darkTheme ? "light" : 'dark'} />
            <TouchableOpacity style={{...styles.Button, backgroundColor: darkTheme ? '#4a4a4a' :"#327ba8"}} onPress={() => setIsVisible(true)}>
                <Text style={styles.ButtonText}>Add chat</Text>
            </TouchableOpacity>
            <TextInput
            placeholder='Search chat'
            placeholderTextColor={darkTheme ? 'white' : 'black'}
            style={{...styles.Input, backgroundColor: darkTheme ? '#4a4a4a' : '#e3e3e3'}}
            />
            <ScrollView>
            {(chatUsersInfo.length !== 0)
                ? chatUsersInfo.map((chatUser:any, index:number) => (
                    <View key={index} style={{...styles.ChatListBox, backgroundColor: darkTheme ? '#212121' : 'white'}}>
                        <TouchableOpacity
                        style={styles.ChatBox}
                        activeOpacity={1}
                        onPress={() => {
                            const current_chat = chats.filter((chat:any) => chatUser._id.toString() === chat.chat_user_id.toString() || chatUser._id.toString() === chat.current_user_id.toString())
                            updateData({...context, current_chat})
                            navigation.navigate('Messages')
                        }}
                        >
                            <Image
                            source={(chatUser.avatar !== null && chatUser.avatar !== '')
                            ? {uri: chatUser.avatar}
                            : require('../../assets/default_user.png')
                        }
                        style={styles.Image}
                        />
                            <Text style={{...styles.Text, color: darkTheme ? 'white' : 'black'}}>{chatUser.firstname} {chatUser.secondname}</Text>
                        </TouchableOpacity>
                    </View>
                ))
                : null
            }
            </ScrollView>
            <Modal
            visible={isVisible}
            animationType='slide'
            transparent={true}
            >
                <View style={{...styles.Modal, backgroundColor: darkTheme ? 'black' : 'white', borderColor: darkTheme ? 'white' : 'black'}}>
                    <Text style={{...styles.ModalText, color: darkTheme ? 'white' : 'black'}}>Add chat with friends</Text>
                    <ScrollView style={{flex: 1}}>
                        {(friends.length !== 0)
                            ? friends.map((friend:any, index:number) => (
                                <View key={index}>
                                    {friend.chats.filter((chatId:string) => context.user.chats.indexOf(chatId) >= 0).length !== 0
                                    ? null
                                    : <View style={{...styles.FriendContainer, backgroundColor: darkTheme ? '#212121' : 'white'}}>
                                        <Image source={(friend.avatar !== '')
                                            ? {uri: friend.avatar}
                                            : require('../../assets/default_user.png')
                                        }
                                        style={{width: 50, height: 50, marginTop: '2.5%', borderRadius:50, marginLeft: '10%'}}
                                        />
                                        <Text style={{marginTop: '4%', marginLeft: '2%', color: darkTheme ? 'white' :'black'}}>{friend.firstname} {friend.secondname}</Text>
                                        <TouchableOpacity onPress={() => addChat(friend.email)}>
                                            <MaterialCommunityIcons
                                            style={{marginLeft: '40%', marginTop: '13%'}}
                                            name="chat-plus"
                                            color={darkTheme ? 'white' :'black'}
                                            size={26}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    } 
                                    
                                </View>
                            ))
                            : <Text style={{marginLeft: '5%'}}>no friends</Text> 
                        }
                    </ScrollView>
                    <TouchableOpacity style={{...styles.Button, backgroundColor: darkTheme ? '#4a4a4a' :"#327ba8"}} onPress={() => setIsVisible(false)}>
                        <Text style={styles.ButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
        

        
    )
    
}

const styles = StyleSheet.create({
    ChatListBox: {
        width: '100%',
        flex: 1,
        marginTop: '3%',
    },
    ChatBox: {
        flexDirection: 'row',
        height: '100%',
    },
    Image: {
        width: '15%',
        height: 50,
        borderRadius: 50,
        marginLeft: '5%',
        marginTop: '2%',
        marginBottom: '2%'
    },
    Text: {
        alignSelf: 'flex-start',
        fontSize: 16,
        // borderWidth: 1,
        marginLeft: '2%',
        marginTop: '3%'
    },
    Input: {
        alignSelf: 'center',
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: '2%'
    },
    Button: {
        borderRadius: 10,
        height: 40,
        width: '50%',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: '2%',
        marginBottom: '3%'
    },
    ButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    Modal: {
        marginTop: '10%',
        height: Dimensions.get('screen').height - 200,
        width: '80%',
        borderWidth: 1,
        borderRadius: 20,
        alignSelf: 'center',
    },
    FriendContainer: {
        height: 65,
        marginTop: '10%',
        flexDirection: 'row'
    },
    Box: {
        height: '80%',
        width: '100%',
        borderWidth: 1
    },
    ModalText: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: 'black',
        marginTop: '2%'
    }
})

export default ChatList;
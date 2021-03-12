import React, { useEffect, useState } from 'react'
import {Text, TouchableOpacity, Modal, ScrollView, View, Image, TextInput, StyleSheet, Dimensions} from 'react-native'
import axios from 'axios';
import {useC, useUpdateC} from '../context/Context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


const ChatList = ({navigation}:any) => {
    
    const {darkTheme, data}:any = useC();
    const {updateData}:any = useUpdateC();

    const [chatUsersInfo, setChatUsersInfo]:any = useState([])
    const [isVisible, setIsVisible] = useState(false)
    const [friends, setFriends] = useState([])
    const [chats, setChats] = useState([])

    useEffect(() => {
        (async () => {
            axios('http://10.0.2.2:8000/get-chats',{
                method: 'get',
                headers: {Authorization: 'Bearer ' + data.token},
            })
                .then((respchats:any) => {
                    setChats(respchats.data.chats)
                    setChatUsersInfo(respchats.data.chatUsersInfo)
                })
                .catch(err => {
                    alert(err)
                    // navigation.navigate('Login')
                })
            axios('http://10.0.2.2:8000/get-friends', {
                method: 'get',
                headers: {Authorization: 'Bearer ' + data.token},
            })
                .then(friendsInfoList => {
                    setFriends(friendsInfoList.data)
                })
                .catch(err => alert(err))
        })()
    }, [])

    const addChat = async (email:any) => {
        axios('http://10.0.2.2:8000/add-chat',{
            method: 'post',
            headers: {Authorization: 'Bearer ' + data.token},
            data: {chat_user: email}
        })
            .then(resp => {
                if (resp.data.msg === 'new chat created') {
                    updateData({...data, user: resp.data.current_user})
                } else {
                    console.log(resp)
                }
            })
            .catch(err => alert(err.message))
    }

    // console.log(chats.filter((chat:any) => chatUsersInfo[0].chats.indexOf(chat) >= 0))

    return (
        <View style={{flex: 1, height: '100%'}}>
            <TouchableOpacity style={styles.Button} onPress={() => setIsVisible(true)}>
                <Text>Add chat</Text>
            </TouchableOpacity>
            <TextInput
            placeholder='Search chat'
            style={styles.Input}
            />
            <ScrollView>
            {(chatUsersInfo.length !== 0)
                ? chatUsersInfo.map((chatUser:any, index:number) => (
                    <View key={index} style={styles.ChatListBox}>
                        <TouchableOpacity
                        style={styles.ChatBox}
                        activeOpacity={1}
                        onPress={() => {
                            const current_chat = chats.filter((chat:any) => chatUser._id.toString() === chat.chat_user_id.toString() || chatUser._id.toString() === chat.current_user_id.toString())
                            updateData({...data, current_chat})
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
                            <Text style={styles.Text}>{chatUser.firstname} {chatUser.secondname}</Text>
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
                <View style={styles.Modal}>
                    {(friends.length !== 0)
                        ? friends.map((friend:any, index:number) => (
                            <View style={styles.FriendContainer} key={index}>
                                {friend.chats.filter((chat:any) => data.user.chats.indexOf(chat) >= 0) && friend.chats.length !== 0
                                ? null
                                :<View style={{flexDirection: 'row'}}>
                                    <Image source={(friend.avatar !== '')
                                        ? {uri: friend.avatar}
                                        : require('../../assets/default_user.png')
                                    }
                                    style={{width: '10%', height: '40%', marginTop: '1%', borderRadius:50}}
                                    />
                                    <Text style={{marginTop: '2%', marginLeft: '2%'}}>{friend.firstname} {friend.secondname}</Text>
                                    <TouchableOpacity onPress={() => addChat(friend.email)}>
                                        <MaterialCommunityIcons
                                        style={{alignSelf: 'flex-end'}}
                                        name="chat-plus"
                                        color={'black'}
                                        size={26}
                                        />
                                    </TouchableOpacity>
                                </View>
                                }
                                
                            </View>
                        ))
                        : <Text style={{marginLeft: '5%'}}>no friends</Text> 
                    }


                    <TouchableOpacity onPress={() => setIsVisible(false)}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
        

        
    )
    
}

const styles = StyleSheet.create({
    ChatListBox: {
        width: '100%',
        height: Dimensions.get('screen').height - 600,
        marginTop: '3%',
        borderWidth: 1
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
        height: '7%',
        width: '80%',
        marginLeft: '10%',
        borderWidth: 1,
        borderRadius: 5
    },
    Button: {
        marginTop: '2%',
        height: '10%',
        width: '20%',
        backgroundColor: 'green',
        alignSelf: 'center'
    },
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
    FriendContainer: {
        flexDirection: 'row',
        height: '30%',
        marginLeft: '5%'
    },
    Box: {
        height: '80%',
        width: '100%',
        borderWidth: 1
    }
})

export default ChatList;
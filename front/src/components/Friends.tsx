import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Text, View, Image, ScrollView, StyleSheet, TextInput, Modal, Dimensions, TouchableOpacity} from 'react-native'
import {useC, useUpdateC} from '../context/Context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { StatusBar } from 'expo-status-bar';
import { useMutation, useQuery, gql } from '@apollo/client';

const cloneDeep = require('lodash.clonedeep');


const Friends = ({navigation}:any) => {

    const {darkTheme, context}:any = useC();
    const {updateData}:any = useUpdateC();
    const [friends, setFriends] = useState([])
    const [isVisible, setIsVisible] = useState(false)
    const [sort, setSort] = useState('')
    const [users, setUsers] = useState([])

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
    const getUsers = gql`
        query getUsers($current_user: String!) {
            getUsers(current_user: $current_user) {
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
    const addF = gql`
        mutation addFriend($user_id: String!, $current_user: String!) {
            addFriend(user_id: $user_id, current_user: $current_user) {
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
    const removeF = gql`
        mutation removeFriend($user_id: String!, $current_user: String!) {
            removeFriend(user_id: $user_id, current_user: $current_user) {
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

    const getF = useQuery(getFriends, {variables: {email: context.user.email}})
    const getU = useQuery(getUsers, {variables: {current_user: context.user.email}})
    const [addFriend] = useMutation(addF)
    const [removeFriend] = useMutation(removeF)

    useEffect(() => {
        if (!getF.loading) {
            const copy = cloneDeep(getF.data.getFriends)
            const newCopy = copy.map((item:any, index:any) => {
                delete item.__typename
                return item
            })
            setFriends(newCopy)
        }
            


            // axios('http://10.0.2.2:8000/get-friends', {
            //     method: 'get',
            //     headers: {Authorization: 'Bearer ' + context.token},
            // })
            //     .then(friendsInfoList => {
            //         setFriends(friendsInfoList.data)
            //     })
            //     .catch(err => alert(err))
            // axios('http://10.0.2.2:8000/get-users', {
            //     method: 'get',
            //     headers: {Authorization: 'Bearer ' + context.token},
            // })
            //     .then(usersInfoList => {
            //         setUsers(usersInfoList.data)
            //     })
            //     .catch(err => alert(err))
        
    },[getF.data])

    useEffect(() => {
        if (!getU.loading) {
            const copy = cloneDeep(getU.data.getUsers)
            const newCopy = copy.map((item:any, index:any) => {
                delete item.__typename
                return item
            })
            setUsers(newCopy)
        }
    }, [getU.data])

    useEffect(() => {
		(() => {
			context.token === '' ? navigation.navigate('Login') : null
		})()
	}, [context.token])

    const addFriendF = async (id:any) => {
        // axios('http://10.0.2.2:8000/add-friend', {
        //     method: 'put',
        //     headers: {Authorization: 'Bearer ' + context.token},
        //     data: {id: id}
        // })
        //     .then(resp => updateData({...context, user: resp.data}))
        //     .catch(err => alert(err))
        addFriend({variables: {user_id: id, current_user: context.user.email}})
            .then((inf:any) => {
                updateData({...context, user: inf.data.addFriend})
            })
            .catch(err => alert(err))
    }

    const removeFriendF = async (id:any) => {
        // axios('http://10.0.2.2:8000/remove-friend', {
        //     method: 'put',
        //     headers: {Authorization: 'Bearer ' + context.token},
        //     data: {id: id}
        // })
        //     .then(resp => updateData({...context, user: resp.data}))
        //     .catch(err => alert(err))
        removeFriend({variables: {user_id: id, current_user: context.user.email}})
            .then((inf:any) => {
                updateData({...context, user: inf.data.removeFriend})
            })
            .catch(err => alert(err))
    }

    return (

        
        <View style={{flex: 1, backgroundColor: darkTheme ? 'black' : 'white'}}>
            <StatusBar style={darkTheme ? "light" : 'dark'} />
            <TouchableOpacity style={{...styles.Button, backgroundColor: darkTheme ? '#4a4a4a' :"#327ba8"}} onPress={() => setIsVisible(true)}>
                <Text style={styles.ButtonText}>Add friends</Text>
            </TouchableOpacity>
            <TextInput
            placeholder='Search'
            placeholderTextColor={darkTheme ? 'white' : '#4a4a4a'}
            style={{...styles.Input, backgroundColor: darkTheme ? '#4a4a4a' : '#e3e3e3'}}
            />
            <Text style={{marginLeft: '5%', marginTop: '1%', fontSize: 20, color: darkTheme ? 'white' : 'black'}}>My Friends</Text>
            <ScrollView style={{marginTop: '1%'}}>
                {(friends.length !== 0)
                    ? friends.map((friend:any, index:number) => (
                        <View style={{...styles.FriendContainer, borderBottomWidth: 0, backgroundColor: darkTheme ? '#212121' : 'white'}} key={index}>
                            <Image source={(friend.avatar !== '')
                                ? {uri: friend.avatar}
                                : require('../../assets/default_user.png')
                            }
                            style={{width: '12%', height: '80%', marginTop: '1%', borderRadius: 50, marginLeft: '5%'}}
                            />
                            <Text style={{marginTop: '2%', marginLeft: '2%', color: darkTheme ? 'white' : 'black'}}>{friend.firstname} {friend.secondname}</Text>
                        </View>
                    ))
                    : <Text style={{marginLeft: '5%'}}>no friends</Text>
                }
            </ScrollView>
            <Modal
            visible={isVisible}
            animationType='slide'
            transparent={true}
            >
                <View style={{...styles.Modal, backgroundColor: darkTheme ? 'black' : 'white', borderColor: darkTheme ? 'white' : 'black'}}>
                    <Text style={{...styles.ModalText, color: darkTheme ? 'white' : 'black'}}>All users</Text>
                    <TextInput 
                    value={sort}
                    onChangeText={(text) => setSort(text)}
                    style={{...styles.ModalSort, backgroundColor: darkTheme ? '#4a4a4a' : '#e3e3e3'}}
                    />
                    <ScrollView style={{marginTop: '3%'}}>
                    {(users.length !== 0 && users !== undefined)
                        ? users.map((user:any, index:any) => (
                            <View key={index} style={{...styles.FriendContainer, marginLeft: 0, backgroundColor: darkTheme ? '#212121' : 'white'}}>
                                <Image source={(user.avatar !== '')
                                    ? {uri: user.avatar}
                                    : require('../../assets/default_user.png')
                                }
                                style={{width: '15%', height: '80%', marginTop: '1%', borderRadius: 50, marginLeft: '10%'}}
                                />
                                <Text style={{marginTop: '2%', marginLeft: '2%', width: '50%', color: darkTheme ? 'white' : 'black' }}>{user.firstname} {user.secondname}</Text>
                                {context.user.friends[index] === user._id
                                    ? <TouchableOpacity style={styles.AddRemFriend} key={index} onPress={() => removeFriendF(user._id)}>
                                        <MaterialCommunityIcons
                                        style={{alignSelf: 'flex-end'}}
                                        name="account-remove"
                                        color={'#962020'}
                                        size={26}
                                        />
                                    </TouchableOpacity>
                                    : <TouchableOpacity style={styles.AddRemFriend} key={index} onPress={() => addFriendF(user._id)}>
                                        <MaterialCommunityIcons
                                        style={{alignSelf: 'flex-end'}}
                                        name="account-plus"
                                        color={'#27781e'}
                                        size={26}
                                        />
                                    </TouchableOpacity>
                                }
                            </View>
                        ))
                        : <Text style={{marginLeft: '5%'}}>no users</Text>
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
    FriendContainer: {
        flexDirection: 'row',
        height: 50,
        width: '100%',
        borderBottomWidth: 1,
        marginTop: '3%'
        // borderWidth: 1
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
    ModalSort: {
        alignSelf: 'center',
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: '2%'
    },
    AddRemFriend: {
        // marginLeft: '10%',
        marginTop: '4%'
    },
    ModalText: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: 'black',
        marginTop: '2%'
    }
})

export default Friends;
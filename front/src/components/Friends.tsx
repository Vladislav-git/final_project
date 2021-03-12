import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Text, View, Image, ScrollView, StyleSheet, TextInput, Modal, Dimensions, TouchableOpacity} from 'react-native'
import {useC, useUpdateC} from '../context/Context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


const Friends = () => {

    const {darkTheme, data}:any = useC();
    const {updateData}:any = useUpdateC();
    const [friends, setFriends] = useState([])
    const [isVisible, setIsVisible] = useState(false)
    const [sort, setSort] = useState('')
    const [users, setUsers] = useState([])

    

    useEffect(() => {
        (async () => {
            axios('http://10.0.2.2:8000/get-friends', {
                method: 'get',
                headers: {Authorization: 'Bearer ' + data.token},
            })
                .then(friendsInfoList => {
                    setFriends(friendsInfoList.data)
                })
                .catch(err => alert(err))
            axios('http://10.0.2.2:8000/get-users', {
                method: 'get',
                headers: {Authorization: 'Bearer ' + data.token},
            })
                .then(usersInfoList => {
                    setUsers(usersInfoList.data)
                })
                .catch(err => alert(err))
        })()
    },[])

    const addFriend = async (id:any) => {
        axios('http://10.0.2.2:8000/add-friend', {
            method: 'put',
            headers: {Authorization: 'Bearer ' + data.token},
            data: {id: id}
        })
            .then(resp => updateData({...data, user: resp.data}))
            .catch(err => alert(err))
    }

    const removeFriend = async (id:any) => {
        axios('http://10.0.2.2:8000/remove-friend', {
            method: 'put',
            headers: {Authorization: 'Bearer ' + data.token},
            data: {id: id}
        })
            .then(resp => updateData({...data, user: resp.data}))
            .catch(err => alert(err))
    }
    console.log(data)
    return (

        
        <View style={{flex: 1}}>
            <TouchableOpacity style={{width: '20%', height: '7%', backgroundColor: 'blue', alignSelf: 'center'}} onPress={() => setIsVisible(true)}>
                <Text>Add friend</Text>
            </TouchableOpacity>
            <TextInput
            placeholder='Search'
            style={styles.Input}
            />
            <Text style={{marginLeft: '5%', marginTop: '1%', fontSize: 20}}>My Friends</Text>
            <ScrollView style={{marginTop: '1%'}}>
                {(friends.length !== 0)
                    ? friends.map((friend:any, index:number) => (
                        <View style={styles.FriendContainer} key={index}>
                            <Image source={(friend.avatar !== '')
                                ? {uri: friend.avatar}
                                : require('../../assets/default_user.png')
                            }
                            style={{width: '10%', height: '40%', marginTop: '1%', borderRadius:50}}
                            />
                            <Text style={{marginTop: '2%', marginLeft: '2%'}}>{friend.firstname} {friend.secondname}</Text>
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
                <View style={styles.Modal}>
                    <Text>111</Text>
                    <TextInput 
                    value={sort}
                    onChangeText={(text) => setSort(text)}
                    />
                    <ScrollView>
                    {(users.length !== 0)
                        ? users.map((user:any, index:any) => (
                            <View key={index} style={styles.FriendContainer}>
                                <Image source={(user.avatar !== '')
                                    ? {uri: user.avatar}
                                    : require('../../assets/default_user.png')
                                }
                                style={{width: '10%', height: '40%', marginTop: '1%', borderRadius:50}}
                                />
                                <Text style={{marginTop: '2%', marginLeft: '2%'}}>{user.firstname} {user.secondname}</Text>
                                {data.user.friends.filter((friendId:any) => friendId === user._id)
                                    ? <TouchableOpacity key={index} onPress={() => removeFriend(user._id)}>
                                        <MaterialCommunityIcons
                                        style={{alignSelf: 'flex-end'}}
                                        name="account-remove"
                                        color={'black'}
                                        size={26}
                                        />
                                    </TouchableOpacity>
                                    : <TouchableOpacity key={index} onPress={() => addFriend(user._id)}>
                                        <MaterialCommunityIcons
                                        style={{alignSelf: 'flex-end'}}
                                        name="account-plus"
                                        color={'black'}
                                        size={26}
                                        />
                                    </TouchableOpacity>
                                }
                                {/* {(data.user.friends.length === 0)
                                    ? <TouchableOpacity key={index} onPress={() => addFriend(user._id)}>
                                        <MaterialCommunityIcons
                                        style={{alignSelf: 'flex-end'}}
                                        name="account-plus"
                                        color={'black'}
                                        size={26}
                                        />
                                        <Text>{'1'}</Text>
                                    </TouchableOpacity>
                                    : data.user.friends.map((friendId:any, index:any) => (
                                    (friendId.toString() === user._id.toString())
                                        ? <TouchableOpacity key={index} onPress={() => removeFriend(user._id)}>
                                            <MaterialCommunityIcons
                                            style={{alignSelf: 'flex-end'}}
                                            name="account-remove"
                                            color={'black'}
                                            size={26}
                                            />
                                            <Text>{friendId.toString() === user._id.toString()? 'true1':'false1'}</Text>
                                        </TouchableOpacity>
                                        : <TouchableOpacity key={index} onPress={() => addFriend(user._id)}>
                                            <MaterialCommunityIcons
                                            style={{alignSelf: 'flex-end'}}
                                            name="account-plus"
                                            color={'black'}
                                            size={26}
                                            />
                                            <Text>{friendId.toString() === user._id.toString()? 'true2':'false2'}</Text>
                                        </TouchableOpacity>
                                ))} */}
                            </View>
                        ))
                        : <Text style={{marginLeft: '5%'}}>no users</Text>
                    }
                    </ScrollView>
                    <TouchableOpacity style={styles.Button} onPress={() => setIsVisible(false)}>
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
        height: 100,
        marginLeft: '5%'
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
        backgroundColor: 'lightgrey',
    },
    ButtonText: {
        fontSize: 14,
        color: '#006aff',
        fontWeight: 'bold',
        alignSelf: 'center',
    }
})

export default Friends;
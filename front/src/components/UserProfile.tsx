import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Text, View, Image, ScrollView, StyleSheet, TextInput, Modal, Dimensions, TouchableOpacity, SafeAreaView} from 'react-native'
import {useC, useUpdateC} from '../context/Context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Video } from 'expo-av';

const UserProfile = ({navigation}:any) => {

    const {darkTheme, data}:any = useC();
    const {updateData}:any = useUpdateC();

    const [posts, setPosts]:any = useState([])
    
    let initialProfile = {
        firstname: '',
        secondname: '',
        email: '',
        password: '',
        created_date: '',
        profile: {
            gender: '',
            birth_date: '',
            city: '',
            phone_number: ''
        },
        friends: [],
        images: [],
        videos: [],
        avatar: '',
        chats: []
    }
    const [profile, setProfile]:any = useState(initialProfile)

    useEffect(() => {
        (async () => {
            axios(`http://10.0.2.2:8000/get-user-posts/${data.user_profile}`,{
                method: 'get',
                headers: {Authorization: 'Bearer ' + data.token},
            })
                .then(allUserPosts => {
                    setPosts(allUserPosts.data)
                })
                .catch(error => {
                    alert(error)
                    navigation.navigate('Login')
                })
            axios(`http://10.0.2.2:8000/get-user-profile/${data.user_profile}`,{
                method: 'get',
                headers: {Authorization: 'Bearer ' + data.token},
            })
                .then(profile => {
                    setProfile(profile.data)
                })
                .catch(error => {
                    alert(error)
                    navigation.navigate('Login')
                })
        })()
        
    },[])


    const changeLike = async (post:any, number:number) => {
		console.log(post)
		if (number === 0) {
			post.like_number -= 1
			post.who_liked = post.who_liked.filter((userId:any) => userId !== data.user._id)
			axios('http://10.0.2.2:8000/change-like', {
				method: 'put',
				headers: {Authorization: 'Bearer ' + data.token},
				data: post
			})
				.then(info => console.log(info.data))
				.catch(err => alert(err))
		} else {
			post.like_number += 1
			post.who_liked.push(data.user._id)
			axios('http://10.0.2.2:8000/change-like', {
				method: 'put',
				headers: {Authorization: 'Bearer ' + data.token},
				data: post
			})
				.then(info => console.log(info.data))
				.catch(err => alert(err))
		}
	}

    console.log(profile)

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.PreProfile}>
                    <Image
                    source={(profile.avatar !== '')
                        ? {uri : profile.avatar}
                        : require('../../assets/default_user.png')
                    }
                    style={styles.MainProfileImage}
                    />
                    <Text style={{fontSize: 25, marginLeft: '5%', marginTop: '5%'}}>
                        {profile.firstname} {profile.secondname}
                    </Text>
                </View>
                {/* <View style={{borderBottomWidth: 1, backgroundColor: 'white'}}>
                    <TouchableOpacity
                    style={{...styles.Button, marginBottom: '2%', marginTop: '1%', width: '90%'}}
                    onPress={() => setProfileModalIsVisible(true)}
                    >
                        <Text style={styles.ButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View> */}
                <View style={styles.Profile}>
                    <View style={{width: '10%', marginTop: '2%', marginBottom: '2%'}}>
                        <MaterialCommunityIcons
                        name='cake'
                        color={'#41454a'}
                        size={26}
                        style={{alignSelf:'flex-end'}}
                        />
                        <MaterialCommunityIcons
                        name='city'
                        color={'#41454a'}
                        size={26}
                        style={{alignSelf:'flex-end'}}
                        />
                        <MaterialCommunityIcons
                        name='phone'
                        color={'#41454a'}
                        size={26}
                        style={{alignSelf:'flex-end'}}
                        />
                    </View>
                    <View style={{marginTop: '2%', marginBottom: '2%'}}>
                        <Text style={styles.ProfileText}>
                            Birth date: {profile.profile.birth_date}
                        </Text>
                        <Text style={styles.ProfileText}>
                            City: {profile.profile.city}
                        </Text>
                        <Text style={styles.ProfileText}>
                            Phone number: {profile.profile.phone_number}
                        </Text>
                    </View>
                </View>
                {(posts.length !== 0)
                ?
                    posts.map((post:any, index:any) => (
                        <View key={index} style={styles.Post}>
                            <View key={index} style={{flexDirection: 'row'}}>
                                <Image
                                source={(post.user_img !== '')
                                ? {uri : post.user_img}
                                : require('../../assets/default_user.png')
                                }
                                style={styles.UserImage}
                                />
                                <Text style={{marginLeft: '3%', marginTop: '4%'}}>
                                    {post.user_name}
                                </Text>
                            </View>
                            
                            <Text style={{marginLeft: '7%', marginTop: '4%'}}>
                                {post.post_text}
                            </Text>
                            {(post.post_img !== '')
                            ?
                                <Image
                                source={{uri: post.post_img}}
                                style={styles.PostImage}
                                />
                            :
                                null
                            }
                            {(post.post_video !== '')
                            ?
                                <Video
                                source={{uri: post.post_video}}
                                style={styles.PostVideo}
                                />
                            :
                                null
                            }
                            <View>
                                {post.who_liked.find((item:any) => item === profile._id)
                                    ? <View style={{borderWidth: 1, flexDirection: 'row'}}>
                                        <TouchableOpacity onPress={() => changeLike(post, 0)}>
                                            <MaterialCommunityIcons
                                            name='heart'
                                            color={'red'}
                                            size={26}
                                            />
                                        </TouchableOpacity>
                                        <Text>{post.like_number}</Text>
                                    </View>
                                    : <View style={{borderWidth: 1, flexDirection: 'row', height: 50}}>
                                        <TouchableOpacity onPress={() => changeLike(post, 1)}>
                                            <MaterialCommunityIcons
                                            name='heart'
                                            color={'#41454a'}
                                            size={26}
                                            />
                                        </TouchableOpacity>
                                        <Text>{post.like_number}</Text>
                                        <Text></Text>
                                    </View>
                                }
                                <TouchableOpacity onPress={() => {
                                    updateData({...data, post})
                                    navigation.navigate('Comments')
                                    
                                }}>
                                    <MaterialCommunityIcons
                                    name='comment'
                                    color={'#41454a'}
                                    size={26}
                                    />
                                    <Text>{post.comment_number}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                : 
                    null
                }
                {/* <Camera style={{height: '30%'}} type={Camera.Constants.Type.back} ref={(ref) => camera(ref)} /> */}
                <View style={{marginBottom: '30%'}}></View>
            </ScrollView>
            </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        backgroundColor: 'lightgrey',
    },
      text: {
        fontSize: 42,
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
    InputHeader: {
        fontSize: 16,
        marginTop: '10%'
    },
    InputContainer: {
        height: '40%',
        width: '90%',
        flexDirection: 'row',
        marginTop: '4%'
    },
    MainProfileImage: {
        height: '70%',
        width: '20%',
        marginLeft: '5%',
        borderRadius: 50,
        marginTop: '3%'
    },
    PreProfile: {
        flexDirection: 'row',
        backgroundColor: 'white',
        width: '100%',
        height: '20%'
    },
    Profile: {
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    ProfileText: {
        fontSize: 18,
        marginLeft: '5%',
        color: '#41454a',
        marginTop: '1%',
        alignSelf: 'flex-start'
    },
    AnythingNewBlock: {
        marginTop: '2%',
        backgroundColor: 'white',
        height: '6%',
        justifyContent: 'center'
    },
    Post: {
        height: 200,
        marginTop: '2%',
        borderWidth: 1,
        backgroundColor: 'white'
    },
    UserImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginLeft: '5%',
        marginTop: '2%'
    },
    PostImage: {
        height: '40%',
        width: '95%',
        alignSelf: 'center',
        marginTop: '5%'
    },
    PostVideo: {
        height: '80%',
        width: '80%',
        alignSelf: 'flex-start',
        marginLeft: '5%',
        marginTop: '5%'
    },
    ProfileModalHeader: {
        alignSelf: 'center',
        fontSize: 24,
        marginTop: '3%',
        fontWeight: 'bold'
    },
    Picker: {
        height: '20%',
        width: '70%',
        alignSelf: 'center',
        marginRight: '30%'
    },
    ProfileModalButtonsContainer: {
        flexDirection: 'row',
        width:'100%',
        marginTop: '5%',
        alignItems: 'center'
    },
    PostModalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: '3%'
    },
    PostModalImage: {
        height: '80%',
        width: '80%',
        marginLeft: '5%',
        marginTop: '5%'
    },
    PostModalVideo: {
        height: '80%',
        width: '80%',
        alignSelf: 'flex-start',
        marginLeft: '5%',
        marginTop: '5%'
    }
})


export default UserProfile
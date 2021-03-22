import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Text, View, Image, ScrollView, StyleSheet, TextInput, Modal, Dimensions, TouchableOpacity, SafeAreaView} from 'react-native'
import {useC, useUpdateC} from '../context/Context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';

const UserProfile = ({navigation}:any) => {

    const {darkTheme, context}:any = useC();
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
            axios(`http://10.0.2.2:8000/get-user-posts/${context.user_profile}`,{
                method: 'get',
                headers: {Authorization: 'Bearer ' + context.token},
            })
                .then(allUserPosts => {
                    setPosts(allUserPosts.data)
                })
                .catch(error => {
                    alert(error)
                    navigation.navigate('Login')
                })
            axios(`http://10.0.2.2:8000/get-user-profile/${context.user_profile}`,{
                method: 'get',
                headers: {Authorization: 'Bearer ' + context.token},
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

    useEffect(() => {
		(() => {
			context.token === '' ? navigation.navigate('Login') : null
		})()
	}, [context.token])


    const changeLike = async (post:any, number:number) => {
		if (number === 0) {
			post.like_number -= 1
			post.who_liked = post.who_liked.filter((userId:any) => userId !== context.user._id)
			axios('http://10.0.2.2:8000/change-like', {
				method: 'put',
				headers: {Authorization: 'Bearer ' + context.token},
				data: post
			})
				.then(info => console.log('ok'))
				.catch(err => alert(err))
		} else {
			post.like_number += 1
			post.who_liked.push(context.user._id)
			axios('http://10.0.2.2:8000/change-like', {
				method: 'put',
				headers: {Authorization: 'Bearer ' + context.token},
				data: post
			})
				.then(info => console.log('ok'))
				.catch(err => alert(err))
		}
	}

    return (
        <View style={{...styles.container, backgroundColor: darkTheme ? 'black' : 'white'}}>
            <StatusBar style={darkTheme ? "light" : 'dark'} />
            <ScrollView style={styles.scrollView}>
                <View style={{...styles.PreProfile, borderBottomWidth: 1, borderBottomColor: darkTheme ? 'grey' : 'lightgrey', backgroundColor: darkTheme ? '#212121' : 'white'}}>
                    <Image
                    source={(profile.avatar !== '')
                        ? {uri : profile.avatar}
                        : require('../../assets/default_user.png')
                    }
                    style={styles.MainProfileImage}
                    />
                    <Text style={{fontSize: 25, marginLeft: '5%', marginTop: '5%', color: darkTheme ? 'white' : 'black'}}>
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
                <View style={{...styles.Profile, borderBottomColor: darkTheme ? 'grey' : 'lightgrey', backgroundColor: darkTheme ? '#212121' : 'white'}}>
                    <View style={{width: '10%', marginTop: '2%', marginBottom: '2%'}}>
                        <MaterialCommunityIcons
                        name='cake'
                        color={darkTheme ? '#787878' : '#41454a'}
                        size={26}
                        style={{alignSelf:'flex-end'}}
                        />
                        <MaterialCommunityIcons
                        name='city'
                        color={darkTheme ? '#787878' : '#41454a'}
                        size={26}
                        style={{alignSelf:'flex-end'}}
                        />
                        <MaterialCommunityIcons
                        name='phone'
                        color={darkTheme ? '#787878' : '#41454a'}
                        size={26}
                        style={{alignSelf:'flex-end'}}
                        />
                    </View>
                    <View style={{marginTop: '2%', marginBottom: '2%', backgroundColor: darkTheme ? '#212121' : 'white'}}>
                        <Text style={{...styles.ProfileText, color: darkTheme ? '#787878' : '#41454a'}}>
                            Birth date: {profile.profile.birth_date}
                        </Text>
                        <Text style={{...styles.ProfileText, color: darkTheme ? '#787878' : '#41454a'}}>
                            City: {profile.profile.city}
                        </Text>
                        <Text style={{...styles.ProfileText, color: darkTheme ? '#787878' : '#41454a'}}>
                            Phone number: {profile.profile.phone_number}
                        </Text>
                    </View>
                </View>
                {(posts.length !== 0)
                ?
                    posts.map((post:any, index:any) => (
                        <View key={index} style={{...styles.Post, backgroundColor: darkTheme ? '#212121' : 'white'}}>
                            <View key={index} style={{flexDirection: 'row'}}>
                                <Image
                                source={(post.user_img !== '')
                                ? {uri : post.user_img}
                                : require('../../assets/default_user.png')
                                }
                                style={styles.UserImage}
                                />
                                <Text style={{marginLeft: '3%', marginTop: '4%', color: darkTheme ? 'white' : 'black'}}>
                                    {post.user_name}
                                </Text>
                            </View>
                            
                            <Text style={{marginLeft: '7%', marginTop: '4%', color: darkTheme ? 'white' : 'black'}}>
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
                            <View style={{flexDirection: 'row'}}>
                                {post.who_liked.find((item:any) => item === profile._id)
                                    ? <View style={{flexDirection: 'row', height: 40, marginTop: '3%', marginLeft: '5%'}}>
                                        <TouchableOpacity onPress={() => changeLike(post, 0)}>
                                            <MaterialCommunityIcons
                                            name='heart-outline'
                                            color={'red'}
                                            size={26}
                                            />
                                        </TouchableOpacity>
                                        <Text style={{marginTop: '3%', color: 'red'}}>{post.like_number}</Text>
                                    </View>
                                    : <View style={{flexDirection: 'row', height: 40, marginTop: '3%', marginLeft: '5%'}}>
                                        <TouchableOpacity onPress={() => changeLike(post, 1)}>
                                            <MaterialCommunityIcons
                                            name='heart-outline'
                                            color={darkTheme ? '#787878' : '#41454a'}
                                            size={26}
                                            />
                                        </TouchableOpacity>
                                        <Text style={{marginTop: '7%', color: darkTheme ? '#787878' : '#41454a'}}>{post.like_number}</Text>
                                    </View>
                                }
                                <TouchableOpacity style={{flexDirection: 'row', height: 40, marginTop: '3%', marginLeft: '10%'}} onPress={() => {
                                    updateData({...context, post})
                                    navigation.navigate('Comments')
                                    
                                }}>
                                    <MaterialCommunityIcons
                                    name='comment-outline'
                                    color={darkTheme ? '#787878' : '#41454a'}
                                    size={26}
                                    />
                                    <Text style={{marginTop: '7%', color: darkTheme ? '#787878' : '#41454a'}}>{post.comment_number}</Text>
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
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
    },
      text: {
        fontSize: 42,
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
        width: '100%',
        height: '20%'
    },
    Profile: {
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        flexDirection: 'row',
    },
    ProfileText: {
        fontSize: 18,
        marginLeft: '5%',
        marginTop: '1%',
        alignSelf: 'flex-start'
    },
    Post: {
        flex: 1,
        marginTop: '2%',
        borderWidth: 1,
    },
    UserImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginLeft: '5%',
        marginTop: '2%'
    },
    PostImage: {
        height: 200,
        width: '100%',
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
})


export default UserProfile
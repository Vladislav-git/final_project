import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {Text, ScrollView, Image, View, Platform, TouchableOpacity, TextInput, Modal, StyleSheet, Dimensions, SafeAreaView} from 'react-native'
import {useC, useUpdateC} from '../context/Context'
import * as ImagePicker from 'expo-image-picker';
import {Picker} from '@react-native-picker/picker';
import { Video } from 'expo-av';
// import { Camera } from 'expo-camera'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { StatusBar } from 'expo-status-bar';
import { useMutation, gql } from '@apollo/client';

const Profile = ({navigation}:any) => {
    const {darkTheme, context}:any = useC();
    const {updateData}:any = useUpdateC();
    
    const [posts, setPosts]:any = useState([])
    const [err, setErr] = useState('')
    const [profileModalIsVisible, setProfileModalIsVisible] = useState(false)
    const [postModalIsVisible, setPostModalIsVisible] = useState(false)
    const [profile, setProfile] = useState(context.user)
    

    let initialPost = {
        user_name: context.user.firstname + context.user.secondname,
        user_img: context.user.avatar,
        user_id: context.user._id,
        post_text: '',
        post_img: '',
        post_video: '',
        like_number: 0,
        who_liked: [],
        comments: [],
        comment_number: 0
    }
    const [newPost, setNewPost] = useState(initialPost)

    const updateProfile = gql`
		query updateProfile($body: User!) {
			updateProfile(body: $body) {
				_id
                firstname
                secondname
                email
                password
                created_date
                profile: {
                    gender
                    birth_date
                    city
                    phone_number
                },
                friends
                images
                videos
                avatar
                chats
		    }
		}
		
	`

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
            axios(`http://10.0.2.2:8000/get-user-posts/${context.user._id}`,{
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
        })()
        
    },[])

    useEffect(() => {
		(() => {
			context.token === '' ? navigation.navigate('Login') : null
		})()
	}, [context.token])

    const saveProfileData = () => {
        axios('http://10.0.2.2:8000/update-profile',{
                method: 'put',
                data: profile,
                headers: {Authorization: 'Bearer ' + context.token},
        })
            .then((data:any) => {
                if (data.data === 'user updated') {
                    updateData({token: data.token, user: profile})
                    setProfileModalIsVisible(false)
                } else {
                    alert(data)
                    navigation.navigate('Login')
                }
            })
            .catch(error => {
                alert(error)
                navigation.navigate('Login')
            })
    }

    const savePostData = () => {
        axios('http://10.0.2.2:8000/add-post',{
                method: 'post',
                data: newPost,
                headers: {Authorization: 'Bearer ' + context.token},
        })
            .then((data:any) => {
                if (data.data === 'post saved') {
                    setNewPost(initialPost)
                    setPostModalIsVisible(false)
                } else {
                    alert(data.data)
                }
            })
            .catch(error => {
                setErr(error)
                alert(err)
                navigation.navigate('Login')
            })
    }

    const cancelProfileChange = () => {
        setProfile(context.user)
        setProfileModalIsVisible(false)
    }

    const cancelAddPost = () => {
        setNewPost(initialPost)
        setPostModalIsVisible(false)
    }

    const addPostImage = async () => {
        let result:any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        setNewPost({...newPost, post_img: result.uri})

    }

    const addPostVideo = async () => {
        let result:any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        setNewPost({...newPost, post_video: result.uri})
    }

    const changeAvatar = async () => {
        let result:any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        setProfile({...profile, avatar: result.uri})
    }


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

    // const camera = async (ref) => {
    //     const photo = await ref.takePictureAsync()
    // }
    
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={darkTheme ? "light" : 'dark'} />
            <ScrollView style={{backgroundColor: darkTheme ? 'black' : 'lightgrey'}}>
                <View style={{...styles.PreProfile, backgroundColor: darkTheme ? '#212121' : 'white'}}>
                    <Image
                    source={(context.user.avatar !== '')
                        ? {uri : context.user.avatar}
                        : require('../../assets/default_user.png')
                    }
                    style={styles.MainProfileImage}
                    />
                    <Text style={{fontSize: 25, marginLeft: '5%', marginTop: '5%', color: darkTheme ? 'white' : 'black'}}>
                        {context.user.firstname} {context.user.secondname}
                    </Text>
                </View>
                <View style={{borderBottomWidth: 1, borderBottomColor: darkTheme ? 'grey' : 'lightgrey', backgroundColor: darkTheme ? '#212121' : 'white'}}>
                    <TouchableOpacity
                    style={{...styles.Button, marginBottom: '2%', marginTop: '1%', width: '90%', backgroundColor: darkTheme ? '#4a4a4a' :"lightgrey"}}
                    onPress={() => setProfileModalIsVisible(true)}
                    >
                        <Text style={{...styles.ButtonText, color: darkTheme ? '#fff' : '#006aff'}}>Edit</Text>
                    </TouchableOpacity>
                </View>
                <View style={{...styles.Profile, borderBottomWidth: 0, backgroundColor: darkTheme ? '#212121' : 'white'}}>
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
                    <View style={{marginTop: '2%', marginBottom: '2%'}}>
                        <Text style={{...styles.ProfileText, color: darkTheme ? '#787878' : '#41454a'}}>
                            Birth date: {context.user.profile.birth_date}
                        </Text>
                        <Text style={{...styles.ProfileText, color: darkTheme ? '#787878' : '#41454a'}}>
                            City: {context.user.profile.city}
                        </Text>
                        <Text style={{...styles.ProfileText, color: darkTheme ? '#787878' : '#41454a'}}>
                            Phone number: {context.user.profile.phone_number}
                        </Text>
                    </View>
                </View>
                <View style={{...styles.AnythingNewBlock, backgroundColor: darkTheme ? '#212121' : 'white'}}>
                    <TextInput
                    style={{
                    alignSelf: 'center',
                    width: '60%',
                    marginTop: 0,
                    borderWidth: 0,
                    backgroundColor: darkTheme ? '#454545' : '#ebe8e8',
                    borderRadius: 5
                    }}
                    placeholder='  Anything new?'
                    placeholderTextColor={darkTheme? 'white' : 'grey'}
                    onFocus={() => setPostModalIsVisible(true)}
                    />
                </View>
                {(posts.length !== 0)
                ?
                    posts.map((post:any, index:any) => (
                        <View key={index} style={{...styles.Post, backgroundColor: darkTheme ? '#212121' : 'white'}}>
                            <View key={index} style={{flexDirection: 'row'}}>
                                <Image
                                source={(context.user.avatar !== '')
                                ? {uri : context.user.avatar}
                                : require('../../assets/default_user.png')
                                }
                                style={styles.UserImage}
                                />
                                <Text style={{marginLeft: '3%', marginTop: '4%', color: darkTheme ? 'white' : 'black'}}>
                                    {context.user.firstname} {context.user.secondname}
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
                            <View style={{flexDirection: 'row', height: 40,}}>
                                {post.who_liked.find((item:any) => item === context.user._id)
                                    ? 
                                        <TouchableOpacity style={{marginTop: '2.5%', height: 50,flexDirection: 'row', marginLeft: '5%'}} onPress={() => changeLike(post, 0)}>
                                            <MaterialCommunityIcons
                                            name='heart-outline'
                                            color={'red'}
                                            size={23}
                                            />
                                            <Text style={{color: 'red', marginTop: '5%'}}>{post.like_number}</Text>
                                        </TouchableOpacity>
                                    : 
                                        <TouchableOpacity style={{marginTop: '2.5%', height: 50, flexDirection: 'row', marginLeft: '5%'}} onPress={() => changeLike(post, 1)}>
                                            <MaterialCommunityIcons
                                            name='heart-outline'
                                            color={darkTheme ? '#787878' : '#41454a'}
                                            size={23}
                                            />
                                            <Text style={{color: darkTheme ? '#787878' : '#41454a', marginTop: '5%'}}>{post.like_number}</Text>
                                        </TouchableOpacity>
                                }
                                <TouchableOpacity style={{flexDirection: 'row', height: 50, marginTop: '2.5%', marginLeft: '10%'}} onPress={() => {
                                    updateData({...context, post})
                                    navigation.navigate('Comments')
                                    
                                }}>
                                    <MaterialCommunityIcons
                                    name='comment-outline'
                                    color={darkTheme ? '#787878' : '#41454a'}
                                    size={23}
                                    />
                                    <Text style={{color: darkTheme ? '#787878' : '#41454a', marginTop: '5%'}}>{post.comment_number}</Text>
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
            {/* profile modal */}
            <Modal
            visible={profileModalIsVisible}
            animationType='slide'
            transparent={true}
            >
                <View style={{...styles.Modal, backgroundColor: darkTheme ? '#212121' : 'white', borderColor: darkTheme ? 'white' : 'black'}}>
                    <Text style={{...styles.ProfileModalHeader, color: darkTheme ? 'white' : 'black'}}>Your Profile</Text>
                    <View style={styles.InputContainer}>
                        <View style={{width: '40%', alignItems: 'flex-end'}}>
                            <Text style={{...styles.InputHeader, marginTop: '6%', color: darkTheme ? 'white' : 'black'}}>Firstname: </Text>
                            <Text style={{...styles.InputHeader, marginTop: '18%',color: darkTheme ? 'white' : 'black'}}>Secondname: </Text>
                            <Text style={{...styles.InputHeader, marginTop: '18%',color: darkTheme ? 'white' : 'black'}}>Birth date: </Text>
                            <Text style={{...styles.InputHeader, marginTop: '18%',color: darkTheme ? 'white' : 'black'}}>City: </Text>
                            <Text style={{...styles.InputHeader, marginTop: '18%',color: darkTheme ? 'white' : 'black'}}>Phone number: </Text>
                            <Text style={{...styles.InputHeader, marginTop: '18%',color: darkTheme ? 'white' : 'black'}}>Gender: </Text>
                        </View>
                        <View style={{width: '70%',}}>
                            <TextInput
                            disableFullscreenUI={false}
                            value={profile.firstname}
                            onChangeText={(firstname) => setProfile({...profile, firstname})}
                            style={{...styles.Input, marginTop: '1%', color: darkTheme ? 'white' : 'black'}}
                            />
                            <TextInput
                            value={profile.secondname}
                            onChangeText={(secondname) => setProfile({...profile, secondname})}
                            style={{...styles.Input, color: darkTheme ? 'white' : 'black'}}
                            />
                            <TextInput
                            value={profile.profile.birth_date}
                            onChangeText={(birth_date) => setProfile({...profile, profile: {...profile.profile, birth_date}})}
                            style={{...styles.Input, color: darkTheme ? 'white' : 'black'}}
                            />
                            <TextInput
                            value={profile.profile.city}
                            onChangeText={(city) => setProfile({...profile, profile: {...profile.profile, city}})}
                            style={{...styles.Input, color: darkTheme ? 'white' : 'black'}}
                            />
                            <TextInput
                            value={profile.profile.phone_number}
                            onChangeText={(phone_number) => setProfile({...profile, profile: {...profile.profile, phone_number}})}
                            style={{...styles.Input, color: darkTheme ? 'white' : 'black'}}
                            />
                            <Picker
                            selectedValue={profile.profile.gender}
                            itemStyle={{backgroundColor: darkTheme ? 'black' : 'white', color: darkTheme ? 'white' : 'white'}}
                            style={{...styles.Picker, color: darkTheme ? 'white' : 'black'}}
                            onValueChange={(gender) => setProfile({...profile, profile: {...profile.profile, gender}})}>
                                <Picker.Item label='Male' value='male'/>
                                <Picker.Item label='Female' value='female'/>
                            </Picker>
                        </View>
                    </View>
                    <View style={{width: '100%', height: '12.5%', marginTop: '20%'}}>
                        <Image
                        source={(profile.avatar !== '')
                            ? {uri: profile.avatar}
                            : require('../../assets/default_user.png')
                        }
                        style={{height: '100%', width: '20%', alignSelf: 'center', borderRadius: 10}}
                        />
                    </View>
                    <View>
                        <TouchableOpacity
                        onPress={() => changeAvatar()}
                        style={{...styles.Button, marginTop: '5%', height: 35, backgroundColor: darkTheme ? '#4a4a4a' :"lightgrey"}}
                        >
                            <Text style={{...styles.ButtonText, color: darkTheme ? '#fff' : '#006aff'}}>
                                Change profile avatar
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ProfileModalButtonsContainer}>
                        <TouchableOpacity
                        onPress={() => saveProfileData()}
                        style={{...styles.Button, width: '25%', marginLeft: '24.5%', height: 35, backgroundColor: darkTheme ? '#4a4a4a' :"lightgrey"}}
                        >
                            <Text style={{...styles.ButtonText, color: darkTheme ? '#fff' : '#006aff'}}>
                                Save
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => cancelProfileChange()}
                        style={{...styles.Button, width: '25%', marginLeft: '2%', height: 35, backgroundColor: darkTheme ? '#4a4a4a' :"lightgrey"}}
                        >
                            <Text style={{...styles.ButtonText, color: darkTheme ? '#fff' : '#006aff'}}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* post create modal */}
            <Modal
            visible={postModalIsVisible}
            animationType='slide'
            transparent={true}
            >
                <View style={{...styles.Modal, backgroundColor: darkTheme ? '#212121' : 'white', borderColor: darkTheme ? 'white' : 'black'}}>
                    <Text style={{...styles.PostModalHeader, color: darkTheme ? 'white' : 'black'}}>Add new post</Text>
                    <TextInput
                    style={{...styles.Input, alignSelf: 'center', borderWidth: 1, color: darkTheme ? 'white' : 'lightgrey'}}
                    placeholder='Anything new?'
                    placeholderTextColor={darkTheme ? 'white' : 'lightgrey'}
                    value={newPost.post_text}
                    onChangeText={(post_text):any => setNewPost({...newPost, post_text})}
                    />
                    <View style={{height: '50%', marginTop: '5%', flexDirection: 'row'}}>
                        <View style={{width: '50%', alignItems: 'center'}}>
                            <Image
                            source={(newPost.post_img !== '')
                                ? {uri: newPost.post_img}
                                : require('../../assets/default_user.png')
                            }
                            style={styles.PostModalImage}
                            />
                        </View>
                        <View style={{width: '50%'}}>
                        {(newPost.post_video !== '')
                            ? <Video
                            source={{uri: newPost.post_video}}
                            style={styles.PostModalVideo}
                            />
                            : <Image
                            source={require('../../assets/default_user.png')}
                            style={styles.PostModalVideo}
                            />
                        }
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: '3%'}}>
                        <TouchableOpacity
                        style={{width: '8%', marginLeft: '5%'}}
                        onPress={() => addPostImage()}
                        >
                            <MaterialCommunityIcons
                            name='file-image'
                            color={darkTheme ? '#787878' : '#41454a'}
                            size={26}
                            style={{alignSelf:'flex-end'}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={{ width: '8%', marginLeft: '2%'}}
                        onPress={() => addPostVideo()}
                        >
                            <MaterialCommunityIcons
                            name='file-video'
                            color={darkTheme ? '#787878' : '#41454a'}
                            size={26}
                            style={{alignSelf:'flex-end'}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', width: '100%', marginTop: '8%'}}>
                        <TouchableOpacity
                        style={{...styles.Button, width: '30%', marginLeft: '18%', backgroundColor: darkTheme ? '#4a4a4a' :"lightgrey"}}
                        onPress={() => savePostData()}
                        >
                            <Text style={{...styles.ButtonText, color: darkTheme ? '#fff' : '#006aff'}}>
                                Save
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={{...styles.Button, width: '30%', marginLeft: '5%', backgroundColor: darkTheme ? '#4a4a4a' :"lightgrey"}}
                        onPress={() => cancelAddPost()}
                        >
                            <Text style={{...styles.ButtonText, color: darkTheme ? '#fff' : '#006aff'}}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        color: '#fff',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    Input: {
        alignSelf: 'center',
        height: 35,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: '2%'
    },
    InputHeader: {
        fontSize: 15,
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
        width: '30%',
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
        flex: 1,
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
        height: 200,
        width: '100%',
        alignSelf: 'center',
        marginTop: '5%'
    },
    PostVideo: {
        height: 200,
        width: '100%',
        alignSelf: 'center',
        marginLeft: '5%',
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
        marginTop: '3%',
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

export default Profile;
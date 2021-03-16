import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {Text, ScrollView, Image, View, Platform, TouchableOpacity, TextInput, Modal, StyleSheet, Dimensions, SafeAreaView} from 'react-native'
import {useC, useUpdateC} from '../context/Context'
import * as ImagePicker from 'expo-image-picker';
import {Picker} from '@react-native-picker/picker';
import { Video } from 'expo-av';
// import { Camera } from 'expo-camera'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Profile = ({navigation}:any) => {
    const {darkTheme, data}:any = useC();
    const {updateData}:any = useUpdateC();
    
    const [posts, setPosts]:any = useState([])
    const [err, setErr] = useState('')
    const [profileModalIsVisible, setProfileModalIsVisible] = useState(false)
    const [postModalIsVisible, setPostModalIsVisible] = useState(false)
    const [profile, setProfile] = useState(data.user)
    

    let initialPost = {
        user_name: data.user.firstname + data.user.secondname,
        user_img: data.user.avatar,
        user_id: data.user._id,
        post_text: '',
        post_img: '',
        post_video: '',
        like_number: 0,
        who_liked: [],
        comments: [],
        comment_number: 0
    }
    const [newPost, setNewPost] = useState(initialPost)

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
            axios(`http://10.0.2.2:8000/get-user-posts/${data.user._id}`,{
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
        })()
        
    },[])

    console.log(posts)

    const saveProfileData = () => {
        axios('http://10.0.2.2:8000/update-profile',{
                method: 'put',
                data: profile,
                headers: {Authorization: 'Bearer ' + data.token},
        })
            .then((data:any) => {
                if (data.data === 'user updated') {
                    updateData({token: data.token, user: profile})
                    setProfileModalIsVisible(false)
                } else {
                    alert(data)
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
                headers: {Authorization: 'Bearer ' + data.token},
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
        setProfile(data.user)
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

    // const camera = async (ref) => {
    //     const photo = await ref.takePictureAsync()
    // }
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.PreProfile}>
                    <Image
                    source={(data.user.avatar !== '')
                        ? {uri : data.user.avatar}
                        : require('../../assets/default_user.png')
                    }
                    style={styles.MainProfileImage}
                    />
                    <Text style={{fontSize: 25, marginLeft: '5%', marginTop: '5%'}}>
                        {data.user.firstname} {data.user.secondname}
                    </Text>
                </View>
                <View style={{borderBottomWidth: 1, backgroundColor: 'white'}}>
                    <TouchableOpacity
                    style={{...styles.Button, marginBottom: '2%', marginTop: '1%', width: '90%'}}
                    onPress={() => setProfileModalIsVisible(true)}
                    >
                        <Text style={styles.ButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
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
                            Birth date: {data.user.profile.birth_date}
                        </Text>
                        <Text style={styles.ProfileText}>
                            City: {data.user.profile.city}
                        </Text>
                        <Text style={styles.ProfileText}>
                            Phone number: {data.user.profile.phone_number}
                        </Text>
                    </View>
                </View>
                <View style={styles.AnythingNewBlock}>
                    <TextInput
                    style={{
                    alignSelf: 'center',
                    width: '60%',
                    marginTop: 0,
                    borderWidth: 0,
                    backgroundColor: '#ebe8e8',
                    borderRadius: 5
                    }}
                    placeholder='  Anything new?'
                    onFocus={() => setPostModalIsVisible(true)}
                    />
                </View>
                {(posts.length !== 0)
                ?
                    posts.map((post:any, index:any) => (
                        <View key={index} style={styles.Post}>
                            <View key={index} style={{flexDirection: 'row'}}>
                                <Image
                                source={(data.user.avatar !== '')
                                ? {uri : data.user.avatar}
                                : require('../../assets/default_user.png')
                                }
                                style={styles.UserImage}
                                />
                                <Text style={{marginLeft: '3%', marginTop: '4%'}}>
                                    {data.user.firstname} {data.user.secondname}
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
                                {post.who_liked.find((item:any) => item === data.user._id)
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
            {/* profile modal */}
            <Modal
            visible={profileModalIsVisible}
            animationType='slide'
            transparent={true}
            >
                <View style={styles.Modal}>
                    <Text style={styles.ProfileModalHeader}>Your Profile</Text>
                    <View style={styles.InputContainer}>
                        <View style={{width: '40%', alignItems: 'flex-end'}}>
                            <Text style={{...styles.InputHeader, marginTop: '4%'}}>Firstname: </Text>
                            <Text style={styles.InputHeader}>Secondname: </Text>
                            <Text style={styles.InputHeader}>Birth date: </Text>
                            <Text style={styles.InputHeader}>City: </Text>
                            <Text style={styles.InputHeader}>Phone number: </Text>
                            <Text style={styles.InputHeader}>Gender: </Text>
                        </View>
                        <View style={{width: '70%',}}>
                            <TextInput
                            disableFullscreenUI={false}
                            value={profile.firstname}
                            onChangeText={(firstname) => setProfile({...profile, firstname})}
                            style={{...styles.Input, marginTop: '1%'}}
                            />
                            <TextInput
                            value={profile.secondname}
                            onChangeText={(secondname) => setProfile({...profile, secondname})}
                            style={styles.Input}
                            />
                            <TextInput
                            value={profile.profile.birth_date}
                            onChangeText={(birth_date) => setProfile({...profile, profile: {...profile.profile, birth_date}})}
                            style={styles.Input}
                            />
                            <TextInput
                            value={profile.profile.city}
                            onChangeText={(city) => setProfile({...profile, profile: {...profile.profile, city}})}
                            style={styles.Input}
                            />
                            <TextInput
                            value={profile.profile.phone_number}
                            onChangeText={(phone_number) => setProfile({...profile, profile: {...profile.profile, phone_number}})}
                            style={styles.Input}
                            />
                            <Picker
                            selectedValue={profile.profile.gender}
                            style={styles.Picker}
                            onValueChange={(gender) => setProfile({...profile, profile: {...profile.profile, gender}})}>
                                <Picker.Item label='Male' value='male'/>
                                <Picker.Item label='Female' value='female'/>
                            </Picker>
                        </View>
                    </View>
                    <View style={{width: '100%', height: '25%'}}>
                        <Image
                        source={(profile.avatar !== '')
                            ? {uri: profile.avatar}
                            : require('../../assets/default_user.png')
                        }
                        style={{height: '100%', width: '30%', alignSelf: 'center'}}
                        />
                    </View>
                    <View>
                        <TouchableOpacity
                        onPress={() => changeAvatar()}
                        style={{...styles.Button, marginTop: '5%'}}
                        >
                            <Text style={styles.ButtonText}>
                                Change profile avatar
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ProfileModalButtonsContainer}>
                        <TouchableOpacity
                        onPress={() => saveProfileData()}
                        style={{...styles.Button, width: '25%', marginLeft: '24.5%'}}
                        >
                            <Text style={styles.ButtonText}>
                                Save
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => cancelProfileChange()}
                        style={{...styles.Button, width: '25%', marginLeft: '2%'}}
                        >
                            <Text style={styles.ButtonText}>
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
                <View style={styles.Modal}>
                    <Text style={styles.PostModalHeader}>Add new post</Text>
                    <TextInput
                    style={{...styles.Input, alignSelf: 'center', borderWidth: 0}}
                    placeholder='Anything new?'
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
                            color={'#41454a'}
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
                            color={'#41454a'}
                            size={26}
                            style={{alignSelf:'flex-end'}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', width: '100%', marginTop: '3%'}}>
                        <TouchableOpacity
                        style={{...styles.Button, width: '30%', marginLeft: '18%'}}
                        onPress={() => savePostData()}
                        >
                            <Text style={styles.ButtonText}>
                                Save
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={{...styles.Button, width: '30%', marginLeft: '5%'}}
                        onPress={() => cancelAddPost()}
                        >
                            <Text style={styles.ButtonText}>
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

export default Profile;
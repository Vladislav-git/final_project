import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {Text, ScrollView, Image, View, Platform, TouchableOpacity, TextInput, Modal, StyleSheet} from 'react-native'
import {useC, useUpdateC} from '../context/Context'
import * as ImagePicker from 'expo-image-picker';
import {Picker} from '@react-native-picker/picker';

const Profile = () => {

    const {darkTheme, data}:any = useC();
    const {updateData}:any = useUpdateC();
    const [posts, setPosts]:any = useState([])
    const [err, setErr] = useState('')
    const [profileModalIsVisible, setProfileModalIsVisible] = useState(false)
    const [postModalIsVisible, setPostModalIsVisible] = useState(false)
    const [profile, setProfile] = useState(data.user)

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })()
        
    },[])

    const saveProfileData = () => {
        axios('http://10.0.2.2:8000/update-profile',{
                method: 'put',
                data: profile,
                headers: {Authorization: 'Bearer ' + data.token},
        })
            .then((data:any) => {
                if (data === 'user updated') {
                    updateData({token: data.token, user: profile})
                    setProfileModalIsVisible(false)
                } else {
                    console.log(data)
                }
            })
            .catch(error => alert(error))
    }

    const cancelProfileChange = () => {
        setProfile(data.user)
        setProfileModalIsVisible(false)
    }

    const addPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.cancelled) {
            axios('http://10.0.2.2:8000/add-photo',{
                method: 'post',
                data: {img : result.uri, user_id: data.user._id},
                headers: {Authorization: 'Bearer ' + data.token},
            })
                .then(data => {
                    console.log(data)
                })
                .catch(error => {
                    console.log(error)
                })

        } else {
            alert('err')
        }
    };

    const addPostImage = async () => {

    }

    const addPostVideo = async () => {

    }

    const changeAvatar = async () => {
        let result = ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result)
        setProfile({...profile, avatar: result.uri})
    }

    console.log(profile)
    
    return (
        <ScrollView style={{height: '100%', width: '100%'}}>
            <View style={{flexDirection: 'row'}}>
                <Image source={(data.user.avatar !== '') ? {uri : data.user.avatar} : require('../../assets/default_user.png')} style={{height: 100, width: 100, marginLeft: '5%'}}></Image>
                <Text style={{fontSize: 25, marginLeft: '5%'}}>{data.user.firstname} {data.user.secondname}</Text>
            </View>
            <View style={{borderBottomWidth: 1}}>
                <TouchableOpacity style={{borderWidth: 1, marginBottom: '1%'}} onPress={() => setProfileModalIsVisible(true)}>
                    <Text style={{alignSelf: 'center'}}>change profile info</Text>
                </TouchableOpacity>
            </View>
            <View style={{alignItems: 'flex-start', borderBottomWidth: 1}}>
                <Text style={{fontSize: 18, marginLeft: '10%'}}>Birth date: {data.user.profile.birth_date}</Text>
                <Text style={{fontSize: 18, marginLeft: '10%'}}>City: {data.user.profile.city}</Text>
                <Text style={{fontSize: 18, marginLeft: '10%'}}>Phone number: {data.user.profile.phone_number}</Text>
            </View>
            <View style={{borderBottomWidth: 1}}>
                <TouchableOpacity style={{alignSelf: 'center'}} onPress={() => setPostModalIsVisible(true)}>
                    <Text>add post</Text>
                </TouchableOpacity>
            </View>
            {/* profile modal */}
            <Modal visible={profileModalIsVisible} animationType="slide" transparent={true}>
                <View style={styles.Modal}>
                    <Text style={{alignSelf: 'center'}}>Your Profile</Text>
                    <TextInput
                    value={profile.firstname}
                    onChangeText={(firstname) => setProfile({...profile, firstname})}
                    style={styles.Input}
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
                    style={{height: 50, width: 100}}
                    onValueChange={(gender) => setProfile({...profile, profile: {...profile.profile, gender}})}>
                        <Picker.Item label='Male' value='male'/>
                        <Picker.Item label='Female' value='female'/>
                    </Picker>
                    <Image source={(profile.avatar !== '') ? {uri: profile.avatar} : require('../../assets/default_user.png')} style={{height: '5%', width: '5%'}}></Image>
                    <TouchableOpacity onPress={() => changeAvatar()} style={styles.Button}>
                        <Text style={styles.ButtonText}>Change profile avatar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => saveProfileData()} style={styles.Button}>
                        <Text style={styles.ButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => cancelProfileChange()} style={styles.Button}>
                        <Text style={styles.ButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            {/* post create modal */}
            <Modal visible={postModalIsVisible} animationType="slide" transparent={true}>
                <View style={styles.Modal}>
                    <TextInput />
                    <TouchableOpacity onPress={() => addPostImage()}>
                        <Text>Add photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => addPostVideo()}>
                        <Text>Add video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setPostModalIsVisible(false)}>
                        <Text>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setPostModalIsVisible(false)}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
               
            </Modal>
            {/* {posts
            ?
                <View>
                    
                </View>
            :} */}
        </ScrollView>
        
    )
    
}

const styles = StyleSheet.create({
    Modal: {
        marginTop: '10%',
        height: '80%',
        width: '80%',
        borderWidth: 1,
        borderRadius: 20,
        color: 'grey',
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: 'white'
    },
    Input: {
        height: 40,
        width: '50%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 10,
    },
    Button: {
        elevation: 8,
        borderRadius: 10,
        height: 40,
        width: '50%',
        alignSelf: 'center',
        justifyContent: 'center',
        display: 'flex',
        marginTop: 30,
        backgroundColor: 'black'
    },
    ButtonText: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
    },
})

export default Profile;
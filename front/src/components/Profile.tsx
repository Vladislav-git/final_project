import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {Text, ScrollView, Image, View, Platform, TouchableOpacity, TextInput, Modal} from 'react-native'
import {useC, useUpdateC} from '../context/Context'
import * as ImagePicker from 'expo-image-picker';


const Profile = () => {


    const {darkTheme, data}:any = useC();
    const {updateData}:any = useUpdateC();
    const [posts, setPosts]:any = useState([])
    const [err, setErr] = useState('')
    const [isVisible, setIsVisible] = useState(false)
    const [profile, setProfile] = useState(data.user)
    // axios('http://http://10.0.2.2:8000/profile',{
    //     method: 'post',
    //     headers: {authorization: 'Bearer '},
        
    // })
    useEffect(() => {
        (async () => {
            axios('http://http://10.0.2.2:8000/profile',{
                method: 'get',
                headers: {authorization: `Bearer ${data.token}`},
            })
                .then(postList => {
                    setPosts(postList)
                })
                .catch(error => {
                    setErr(error)
                    alert(err)
                })
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })()
        
    },[])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
            axios('http://http://10.0.2.2:8000/addphoto',{
                method: 'post',
                data: result.uri,
                headers: {authorization: `Bearer ${data.token}`},
            })
                .then()
                .catch()
        } else {

        }
    };
    
    return (
        <ScrollView style={{height: '100%', width: '100%'}}>
            <View style={{flexDirection: 'row'}}>
                <Image source={require('../../assets/default_user.png')} style={{height: 100, width: 100, marginLeft: '5%'}}></Image>
                <Text style={{fontSize: 25, marginLeft: '5%'}}>{data.user[0].firstname} {data.user[0].secondname}</Text>
            </View>
            <View style={{borderBottomWidth: 1}}>
                <TouchableOpacity style={{borderWidth: 1, marginBottom: '1%'}}>
                    <Text style={{alignSelf: 'center'}}>change profile info</Text>
                </TouchableOpacity>
            </View>
            <View style={{alignItems: 'flex-start', borderBottomWidth: 1}}>
                <Text style={{fontSize: 18, marginLeft: '10%'}}>Birth date: {data.user[0].profile.birth_date}</Text>
                <Text style={{fontSize: 18, marginLeft: '10%'}}>City: {data.user[0].profile.city}</Text>
                <Text style={{fontSize: 18, marginLeft: '10%'}}>Phone number: {data.user[0].profile.phone_number}</Text>
            </View>
            <View style={{borderBottomWidth: 1}}>
                <TouchableOpacity style={{alignSelf: 'center'}}>
                    <Text>add post</Text>
                </TouchableOpacity>
            </View>
            <Modal visible={isVisible}>
                <TextInput
                placeholder='Birth'
                />
                <TextInput
                placeholder='City'
                />
                <TextInput
                placeholder='Gender'
                />
                <TextInput
                placeholder='Phone'
                />
                <TouchableOpacity>
                    <Text>change profile avatar</Text>
                </TouchableOpacity>
            </Modal>
            {/* {posts
            ?
                <View>
                    
                </View>
            :} */}
        </ScrollView>
        
    )
    
}

export default Profile;
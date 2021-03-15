import React, {useState, useRef, useEffect} from 'react';
import {Text, TouchableOpacity, TextInput, View, StyleSheet, Image, Modal, Dimensions, Platform, Button, ScrollView} from 'react-native';
import {useC, useUpdateC} from '../context/Context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios';
import {io} from 'socket.io-client'



const Comments = ({navigation}:any) => {

    const {darkTheme, data}:any = useC();
    const {updateData}:any = useUpdateC();
    const [allComments, setAllComments] = useState([])
    
    const initialComment = {
        user_id: data.user._id,
        post_id: data.post._id,
        comment_text: '',
        comment_img: '',
        comment_video: '',
    }

    const [comment, setComment] = useState(initialComment)

    useEffect(() => {
        (async() => {
            socket.emit('get-messages', info)
            socket.on('get-messages', (msg:any) => {
                // setAllMessages(msg.allMessages)
                // setChatUserInfo(msg.chatUserInfo)
            })
        })()
    },[])

    const socket = io('http://192.168.31.181:8000')

    

    const addComment = async () => {
        axios(`http://10.0.2.2:8000/add-comment`, {
				method: 'post',
				headers: {Authorization: 'Bearer ' + data.token},
                data: comment
			})
			.then((info:any) => console.log(info.data))
			.catch(err => alert(err))
    }

    console.log(allComments)

    return (
        <View>
            <View>

            </View>
            <ScrollView>
                {allComments.map((comment:any, index:number) => (
                    <View>

                    </View>
                ))}

            </ScrollView>
            <View>
                <TextInput
                onChangeText={(text:any) => setComment(text)}
                />
                <TouchableOpacity onPress={() => addComment()}>
                    <MaterialCommunityIcons style={{alignSelf: 'center'}} name="send" color={'lightblue'} size={26} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Comments
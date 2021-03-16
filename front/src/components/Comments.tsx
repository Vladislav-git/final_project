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
        (() => {
            socket.emit('get-comments', data.post._id)
            socket.on('get-comments', (comments:any) => {
                setAllComments(comments)
            })
        })()
    },[])

    const socket = io('http://192.168.31.181:8000')

    

    const addComment = (comment:any) => {
        socket.emit('add-comment', comment)
        setComment(initialComment)
        socket.on('add-comment', (post:any) => {
            updateData({...data, post: post})
        })
    }

    console.log(allComments)

    return (
        <View>
            <View>
            {/* post here */}
            </View>
            <ScrollView>
                {allComments.map((comment:any, index:number) => (
                    <View key={index}>
                        <Text>{comment.comment_text}</Text>
                    </View>
                ))}

            </ScrollView>
            <View>
                <TextInput
                value={comment.comment_text}
                onChangeText={(text:any) => setComment({...comment, comment_text: text})}
                />
                <TouchableOpacity onPress={() => addComment(comment)}>
                    <MaterialCommunityIcons style={{alignSelf: 'center'}} name="send" color={'lightblue'} size={26} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Comments
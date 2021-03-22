import React, {useState, useRef, useEffect} from 'react';
import {Text, TouchableOpacity, TextInput, View, StyleSheet, Image, Modal, Dimensions, Platform, Button, ScrollView} from 'react-native';
import {useC, useUpdateC} from '../context/Context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios';
import {io} from 'socket.io-client'
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';



const Comments = ({navigation}:any) => {

    const {darkTheme, context}:any = useC();
    const {updateData}:any = useUpdateC();
    const [allComments, setAllComments] = useState([])
    const [isVisible, setIsVisible] = useState(false)
    
    const initialComment = {
        user_id: context.user._id,
        post_id: context.post._id,
        comment_text: '',
        comment_img: '',
        comment_video: '',
    }

    const [comment, setComment] = useState(initialComment)

    useEffect(() => {
        (() => {
            socket.emit('get-comments', context.post._id)
            socket.on('get-comments', (comments:any) => {
                setAllComments(comments)
            })
        })()
    },[])

    useEffect(() => {
		(() => {
			context.token === '' ? navigation.navigate('Login') : null
		})()
	}, [context.token])

    const socket = io('http://192.168.31.181:8000')

    const Cancel = () => {
        setComment({...initialComment, comment_text: comment.comment_text})
        setIsVisible(false)
    }

    const addComment = (comment:any) => {
        socket.emit('add-comment', comment)
        setComment(initialComment)
        socket.on('add-comment', (post:any) => {
            updateData({...context, post: post})
        })
    }

    const getPhoto = async () => {
        let result:any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        setComment({...comment, comment_img: result.uri})
        setIsVisible(false)
    }

    const getVideo = async () => {
        let result:any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        setComment({...comment, comment_video: result.uri})
        setIsVisible(false)
    }

    return (
        <View style={{flex: 1, backgroundColor: darkTheme ? 'black' : 'white'}}>
            <StatusBar style={darkTheme ? "light" : 'dark'} />
            <ScrollView>
                <View>
                    <View style={{...styles.Post, backgroundColor: darkTheme ? '#212121' : 'white'}}>
                        <View style={{flexDirection: 'row'}}>
                            <Image
                            source={(context.post.user_img !== '')
                            ? {uri : context.post.user_img}
                            : require('../../assets/default_user.png')
                            }
                            style={styles.UserImage}
                            />
                            <Text style={{marginLeft: '3%', marginTop: '4%', color: darkTheme ? 'white' : 'black'}}>
                                {context.post.user_name}
                            </Text>
                        </View>
                        
                        <Text style={{marginLeft: '7%', marginTop: '4%', color: darkTheme ? 'white' : 'black'}}>
                            {context.post.post_text}
                        </Text>
                        {(context.post.post_img !== '')
                        ?
                            <Image
                            source={{uri: context.post.post_img}}
                            style={styles.PostImage}
                            />
                        :
                            null
                        }
                        {(context.post.post_video !== '')
                        ?
                            <Video
                            source={{uri: context.post.post_video}}
                            style={styles.PostVideo}
                            />
                        :
                            null
                        }
                    </View>
                </View>
                {allComments.map((comment:any, index:number) => (
                    <View key={index} style={{...styles.Post, backgroundColor: darkTheme ? '#212121' : 'white'}}>
                        <Text style={{marginLeft: '7%', marginTop: '4%', color: darkTheme ? 'white' : 'black'}}>{comment.comment_text}</Text>
                        {(comment.comment_img !== '')
                        ?
                            <Image
                            source={{uri: comment.comment_img}}
                            style={styles.PostImage}
                            />
                        :
                            null
                        }
                        {(comment.comment_video !== '')
                        ?
                            <Video
                            source={{uri: comment.comment_video}}
                            style={styles.PostVideo}
                            />
                        :
                            null
                        }
                    </View>
                ))}

            </ScrollView>
            <View style={{...styles.Box, backgroundColor: darkTheme ? '#212121' : 'white', borderColor: darkTheme ? 'white' : 'black'}}>
                <TouchableOpacity style={styles.Button} onPress={() => setIsVisible(true)}>
                    <MaterialCommunityIcons style={{alignSelf: 'center'}} name="paperclip" color={'lightgrey'} size={26} />
                </TouchableOpacity>
                <TextInput
                style={{...styles.Input, color: darkTheme ? 'white' : 'black'}}
                placeholder=' Comment'
                placeholderTextColor={darkTheme ? 'lightgrey' : 'grey'}
                value={comment.comment_text}
                onChangeText={(text:any) => setComment({...comment, comment_text: text})}
                />
                <TouchableOpacity style={styles.Button} onPress={() => addComment(comment)}>
                    <MaterialCommunityIcons style={{alignSelf: 'center'}} name="send" color={'lightblue'} size={26} />
                </TouchableOpacity>
            </View>
            <Modal
            visible={isVisible}
            animationType='none'
            transparent={true}
            onRequestClose={() => Cancel()}
            >
                <View style={{...styles.Modal, backgroundColor: darkTheme ? 'black' : 'white'}}>
                    <View style={{flex: 1, flexDirection: 'row', borderTopWidth:1, borderTopColor: darkTheme ? 'grey' : 'lightgrey'}}>
                        <TouchableOpacity style={{...styles.Button, height: '100%',width: '50%', marginLeft: 0, borderRightWidth: 1, borderRightColor: darkTheme ? 'grey' : 'lightgrey', flexDirection: 'row', marginTop: 0}} onPress={() => getPhoto()}>
                            <MaterialCommunityIcons style={{alignSelf: 'center'}} name="image" color={'#7aadff'} size={26} />
                            <Text style={{alignSelf: 'center', color: '#7aadff'}}>Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{...styles.Button, height: '100%',width: '50%', marginLeft: 0, flexDirection: 'row', marginTop: 0}} onPress={() => getVideo()}>
                            <MaterialCommunityIcons style={{alignSelf: 'center'}} name="video-box" color={'#7aadff'} size={26} />
                            <Text style={{alignSelf: 'center', color: '#7aadff'}}>Video</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    Box: {
        flexDirection: 'row',
        height: '10%',
        width: '100%',
    },
    Input: {
        height: '70%',
        width: '70%',
        borderRadius: 5,
        marginLeft: '2%',
        marginTop: '3%',
    },
    Button: {
        marginLeft: '2%',
        height: 40,
        width: '10%',
        marginTop: '2%',
        justifyContent: 'center',
    },
    Modal: {
        marginTop: Dimensions.get('screen').height*0.74,
        // flex: 1,
        height: 50,
        width: '100%',
        color: 'grey',
        alignSelf: 'center',
        backgroundColor: 'white',
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
})

export default Comments
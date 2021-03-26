import React, {useState, useRef, useEffect} from 'react';
import {Text, TouchableOpacity, TextInput, View, StyleSheet, Image, Modal, Dimensions, Platform, Button, ScrollView} from 'react-native';
// import firebase from 'firebase'
// import Constants from 'expo-constants';
// import * as Notifications from 'expo-notifications';
import { Video } from 'expo-av';
import axios from 'axios';
import {useC, useUpdateC} from '../context/Context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Camera } from 'expo-camera'
import { StatusBar } from 'expo-status-bar';
import { useQuery, useMutation, gql } from '@apollo/client';

const cloneDeep = require('lodash.clonedeep');

// Notifications.setNotificationHandler({
// 	handleNotification: async () => ({
// 	  shouldShowAlert: true,
// 	  shouldPlaySound: false,
// 	  shouldSetBadge: false,
// 	}),
//   });

// const News = () => {

	
// 	const [expoPushToken, setExpoPushToken] = useState('');
// 	const [notification, setNotification]:any = useState(false);
// 	const notificationListener:any = useRef();
// 	const responseListener:any = useRef();
  
// 	useEffect(() => {
// 	  registerForPushNotificationsAsync().then((token:any) => setExpoPushToken(token));
// 	  notificationListener.current = Notifications.addNotificationReceivedListener((notification:any) => {
// 		setNotification(notification);
// 	  });
  
// 	//   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
// 	// 	console.log(response);
// 	//   });
  
// 	  return () => {
// 		Notifications.removeNotificationSubscription(notificationListener);
// 		Notifications.removeNotificationSubscription(responseListener);
// 	  };
// 	}, []);
  
// 	return (
// 	  <View
// 		style={{
// 		  flex: 1,
// 		  alignItems: 'center',
// 		  justifyContent: 'space-around',
// 		}}>
// 		<View style={{ alignItems: 'center', justifyContent: 'center' }}>
// 		  <Text>Title: {notification && notification.request.content.title} </Text>
// 		  <Text>Body: {notification && notification.request.content.body}</Text>
// 		  <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
// 		</View>
// 		<Button
// 		  title="Press to schedule a notification"
// 		  onPress={async () => {
// 			await schedulePushNotification();
// 		  }}
// 		/>
// 	  </View>
// 	);
//   }
  
//   async function schedulePushNotification() {
// 	await Notifications.scheduleNotificationAsync({
// 	  content: {
// 		title: "You've got mail! 📬",
// 		body: 'Here is the notification body',
// 		data: { data: 'goes here' },
// 	  },
// 	  trigger: { seconds: 2 },
// 	});
//   }
  
//   async function registerForPushNotificationsAsync() {
// 	let token;
// 	if (Constants.isDevice) {
// 	  const { status: existingStatus } = await Notifications.getPermissionsAsync();
// 	  let finalStatus = existingStatus;
// 	  if (existingStatus !== 'granted') {
// 		const { status } = await Notifications.requestPermissionsAsync();
// 		finalStatus = status;
// 	  }
// 	  if (finalStatus !== 'granted') {
// 		alert('Failed to get push token for push notification!');
// 		return;
// 	  }
// 	  token = (await Notifications.getExpoPushTokenAsync()).data;
// 	}
  
// 	if (Platform.OS === 'android') {
// 	  Notifications.setNotificationChannelAsync('default', {
// 		name: 'default',
// 		importance: Notifications.AndroidImportance.MAX,
// 		vibrationPattern: [0, 250, 250, 250],
// 		lightColor: '#FF231F7C',
// 	  });
// 	}
  
// 	return token;
//   }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		//   paddingTop: StatusBar.currentHeight,
// 	},
// 	scrollView: {
// 		backgroundColor: 'pink',
// 		//   marginHorizontal: 20,
// 	},
// 	text: {
// 		fontSize: 42,
// 	},
// });


const News = ({navigation}:any) => {

	const {darkTheme, context}:any = useC();
    const {updateData}:any = useUpdateC();
	const [allPosts, setAllPosts] = useState([])

	const getAllPosts = gql`
		query getAllPosts($current_user: String!) {
			getAllPosts(current_user: $current_user) {
				user_name
				user_img
				user_id
				post_text
				post_img
				post_video
				like_number
				who_liked
				comments
				comment_number
				_id
		  }
		}
	`
	const changeL = gql`
		mutation changeLike($post: PostInput!){
			changeLike(post: $post) {
				msg
			}
		}
	`


	const { loading, error, data} = useQuery(getAllPosts,{variables: {current_user: context.user.email}});
	const [changeLike] = useMutation(changeL)
	
	useEffect(() => {
		if (!loading) {
			const copy = cloneDeep(data.getAllPosts)
			const newCopy = copy.map((item:any, index:any) => {
				delete item.__typename
				return item
			})
			setAllPosts(newCopy)
		}
	},[data])

	// useEffect(() => {
    //     (async () => {
    //         axios('http://10.0.2.2:8000/get-all-posts', {
	// 			method: 'get',
	// 			headers: {Authorization: 'Bearer ' + context.token},
	// 		})
	// 			.then((info:any) => setAllPosts(info.data))
	// 			.catch(err => alert(err))
    //     })()
    // }, [])

	useEffect(() => {
		(() => {
			context.token === '' ? navigation.navigate('Login') : null
		})()
	}, [context.token])

	const changeLikeC = async (post:any, number:number) => {
		if (number === 0) {
			post.like_number -= 1
			post.who_liked = post.who_liked.filter((userId:any) => userId !== context.user._id)
			// axios('http://10.0.2.2:8000/change-like', {
			// 	method: 'put',
			// 	headers: {Authorization: 'Bearer ' + context.token},
			// 	data: post
			// })
			// 	.then(info => console.log('ok'))
			// 	.catch(err => alert(err))
			changeLike({variables: {post: post}})
				.then(({data}:any) => console.log(data.changeLike.msg))
				.catch(err => alert(err))
		} else {
			post.like_number += 1
			post.who_liked.push(context.user._id)
			// axios('http://10.0.2.2:8000/change-like', {
			// 	method: 'put',
			// 	headers: {Authorization: 'Bearer ' + context.token},
			// 	data: post
			// })
			// 	.then(info => console.log('ok'))
			// 	.catch(err => alert(err))
			changeLike({variables: {post: post}})
				.then(({data}:any) => console.log(data.changeLike.msg))
				.catch(err => alert(err))
		}
	}

	const userProfile = (userId:any) => {
		updateData({...context, user_profile: userId})
		navigation.navigate('UserProfile')
	}

	return (
		<View style={{...styles.MainView, backgroundColor: darkTheme ? 'black' : 'lightgrey'}}>
			<StatusBar style={darkTheme ? "light" : 'dark'} />
			<ScrollView style={{height: '100%'}}>
				{(allPosts.length !== 0 && allPosts !== undefined)
					? allPosts.map((post:any, index:any) => (
                        <View key={index} style={{...styles.Post, backgroundColor: darkTheme ? '#141414' : 'white'}}>
                            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => userProfile(post.user_id)}>
                                <Image
                                source={(post.user_img !== '')
                                ? {uri : post.user_img}
                                : require('../../assets/default_user.png')
                                }
                                style={styles.UserImage}
                                />
                                <Text style={{marginLeft: '3%', marginTop: '2%', color: darkTheme ? 'white' : 'black'}}>
                                    {post.user_name}
                                </Text>
                            </TouchableOpacity>
                            
                            <Text style={{...styles.PostText, color: darkTheme ? 'white' : 'black'}}>
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
							<View style={styles.PostBottom}>
								{post.who_liked.find((item:any) => item === context.user._id)
									? <View style={styles.Heart}>
										<TouchableOpacity onPress={() => changeLikeC(post, 0)}>
											<MaterialCommunityIcons
											name='heart-outline'
											color={'red'}
											size={23}
											/>
										</TouchableOpacity>
										<Text style={{...styles.HeartNumber, color: 'red'}}>{post.like_number}</Text>
									</View>
									: <View style={styles.Heart}>
										<TouchableOpacity onPress={() => changeLikeC(post, 1)}>
											<MaterialCommunityIcons
											name='heart-outline'
											color={darkTheme ? '#787878' : '#41454a'}
											size={23}
											/>
										</TouchableOpacity>
										<Text style={{...styles.HeartNumber, color: darkTheme ? '#787878' : '#41454a'}}>{post.like_number}</Text>
									</View>
								}
								<TouchableOpacity style={styles.Comment} onPress={() => {
									updateData({...context, post})
									navigation.navigate('Comments')
								}}>
									<MaterialCommunityIcons
									name='comment-outline'
									color={darkTheme ? '#787878' : '#41454a'}
									size={23}
									/>
									<Text style={{...styles.CommentNumber, color: darkTheme ? '#787878' : '#41454a'}}>{post.comment_number}</Text>
								</TouchableOpacity>
							</View>
                        </View>
					))
					: <Text>no posts yet</Text>
				}
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	MainView: {
		flex: 1,
		minWidth: 400,
		maxWidth: 600,
	},
	Post: {
		flex: 1,
        marginTop: '2%',
        backgroundColor: 'white',
		flexDirection: 'column',

    },
    UserImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginLeft: '4%',
        marginTop: '2%'
    },
	PostText: {
		marginLeft: '7%',
		marginTop: '4%',
		// borderWidth: 1,
		height: 25
	},
	PostImage: {
		height: 200,
		width: '100%',
		alignSelf: 'center',
		marginTop: '3%',
		marginBottom: '3%'
	},
	PostVideo: {
		height: 200,
		width: '100%',
		alignSelf: 'center',
		marginTop: '3%'
	},
	PostBottom: {
		flexDirection: 'row',
		// borderWidth: 1,
		height: 40,
	},
	Heart: {
		flexDirection: 'row',
		height: 40,
		width: 50,
		marginLeft: '4%',
		marginTop: '2%'
		// borderWidth: 1
	},
	Comment: {
		flexDirection: 'row',
		height: 40,
		width: 50,
		marginLeft: '10%',
		marginTop: '2%'
		// borderWidth: 1
	},
	HeartNumber: {
		marginTop: '2%',
		fontSize: 16,
		fontStyle: 'normal',
		marginLeft: '3%'
	},
	CommentNumber: {
		marginTop: '2%',
		fontSize: 16,
		fontStyle: 'normal',
		marginLeft: '3%'
	}
});

export default News;
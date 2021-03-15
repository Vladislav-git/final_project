import React, {useState, useRef, useEffect} from 'react';
import {Text, TouchableOpacity, TextInput, View, StyleSheet, Image, Modal, Dimensions, Platform, Button, ScrollView} from 'react-native';
// import firebase from 'firebase'
// import Constants from 'expo-constants';
// import * as Notifications from 'expo-notifications';
import { Video } from 'expo-av';
import axios from 'axios';
import {useC, useUpdateC} from '../context/Context'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

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

	const {darkTheme, data}:any = useC();
    const {updateData}:any = useUpdateC();
	const [allPosts, setAllPosts] = useState([])

	useEffect(() => {
        (async () => {
            axios('http://10.0.2.2:8000/get-all-posts', {
				method: 'get',
				headers: {Authorization: 'Bearer ' + data.token},
			})
			.then((info:any) => setAllPosts(info.data))
			.catch(err => alert(err))
        })()
    }, [])

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

	// console.log(allPosts)

	return (
		<View style={{height: '100%'}}>
			<ScrollView>
				{(allPosts.length !== 0)
					? allPosts.map((post:any, index:any) => (
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
					))
					: <Text>no posts yet</Text>
				}
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
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
});

export default News;
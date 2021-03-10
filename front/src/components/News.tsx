import React, {useState, useRef, useEffect} from 'react';
import {Text, TouchableOpacity, TextInput, View, StyleSheet, Image, Modal, Dimensions, Platform, Button} from 'react-native';
import firebase from 'firebase'
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
	  shouldShowAlert: true,
	  shouldPlaySound: false,
	  shouldSetBadge: false,
	}),
  });

const News = () => {

	
	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification]:any = useState(false);
	const notificationListener:any = useRef();
	const responseListener:any = useRef();
  
	useEffect(() => {
	  registerForPushNotificationsAsync().then((token:any) => setExpoPushToken(token));
	  notificationListener.current = Notifications.addNotificationReceivedListener((notification:any) => {
		setNotification(notification);
	  });
  
	//   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
	// 	console.log(response);
	//   });
  
	  return () => {
		Notifications.removeNotificationSubscription(notificationListener);
		Notifications.removeNotificationSubscription(responseListener);
	  };
	}, []);
  
	return (
	  <View
		style={{
		  flex: 1,
		  alignItems: 'center',
		  justifyContent: 'space-around',
		}}>
		<View style={{ alignItems: 'center', justifyContent: 'center' }}>
		  <Text>Title: {notification && notification.request.content.title} </Text>
		  <Text>Body: {notification && notification.request.content.body}</Text>
		  <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
		</View>
		<Button
		  title="Press to schedule a notification"
		  onPress={async () => {
			await schedulePushNotification();
		  }}
		/>
	  </View>
	);
  }
  
  async function schedulePushNotification() {
	await Notifications.scheduleNotificationAsync({
	  content: {
		title: "You've got mail! 📬",
		body: 'Here is the notification body',
		data: { data: 'goes here' },
	  },
	  trigger: { seconds: 2 },
	});
  }
  
  async function registerForPushNotificationsAsync() {
	let token;
	if (Constants.isDevice) {
	  const { status: existingStatus } = await Notifications.getPermissionsAsync();
	  let finalStatus = existingStatus;
	  if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	  }
	  if (finalStatus !== 'granted') {
		alert('Failed to get push token for push notification!');
		return;
	  }
	  token = (await Notifications.getExpoPushTokenAsync()).data;
	}
  
	if (Platform.OS === 'android') {
	  Notifications.setNotificationChannelAsync('default', {
		name: 'default',
		importance: Notifications.AndroidImportance.MAX,
		vibrationPattern: [0, 250, 250, 250],
		lightColor: '#FF231F7C',
	  });
	}
  
	return token;
  }

const styles = StyleSheet.create({
	container: {
		flex: 1,
		//   paddingTop: StatusBar.currentHeight,
	},
	scrollView: {
		backgroundColor: 'pink',
		//   marginHorizontal: 20,
	},
	text: {
		fontSize: 42,
	},
});

export default News;
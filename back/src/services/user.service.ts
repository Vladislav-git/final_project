const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import mongoose from 'mongoose';
import {usermodel, postmodel, commentmodel, chatmodel, messagemodel} from '../db_models/user.db_model'

class UsersService {

	login = async (body:any) => {
		const user:any = await usermodel.find({email: body.email})
		if (user[0] === undefined) {
			return 'no such user'
		} else {
			if (bcrypt.compareSync(body.password, user[0].password) === true) {
				const token = jwt.sign(body.email, 'somesecretkey');
				return {token, user: user[0]}
			} else {
				return 'wrong password'
			}
		}
	};

    register = async (body:any) => {
		const user = await usermodel.find({email: body.email})
		if (user[0] === undefined) {
			await usermodel.create({
				email: body.email,
				password: body.password,
				firstname: body.firstname,
				secondname: body.secondname,
				created_date: body.created_date,
				profile: {
					gender: 'male',
					birth_date: 'choose birth date',
					city: 'choose city',
					phone_number: 'choose phone number'
				},
				avatar: '',
				chats: []
			})
			return 'user created'
		} else {
			return 'this email already exists'
		}
	}

	google = async (body:any) => {
		const user:any = await usermodel.find({email: body.email})
		if (user[0] === undefined) {
			return 'no such user'
		} else {
			const token = jwt.sign(body.email, 'somesecretkey');
			return {token, user: user[0]}
		}
	}

	// addPost = async (body:any) => {
	// 	const post:any = await postmodel.create({
	// 		user_name: body.user_name,
	// 		user_img: body.user_img,
	// 		user_id: mongoose.Types.ObjectId(body.user_id),
	// 		post_text: body.post_text,
	// 		post_img: body.post_img,
	// 		post_video: body.post_video,
	// 		like_number: body.like_number,
	// 		who_liked: body.who_liked,
	// 		comments: body.comments,
	// 		comment_number: body.comment_number
	// 	})
	// 	return 'post saved'
	// }

	// removeFriend = async (user_id:any, current_user:any) => {
	// 	const currentUser:any = await usermodel.find({email: current_user})
	// 	const user:any = await usermodel.find({_id: user_id.id})
	// 	const indexC:any = currentUser[0].friends.findIndex((item:any) => mongoose.Types.ObjectId(item) === mongoose.Types.ObjectId(user[0]._id))
	// 	const indexU:any = user[0].friends.findIndex((item:any) => mongoose.Types.ObjectId(item) === mongoose.Types.ObjectId(currentUser[0]._id))
	// 	currentUser[0].friends.splice(indexC, 1)
	// 	user[0].friends.splice(indexU, 1)
	// 	await usermodel.updateOne({email: current_user}, currentUser[0])
	// 	await usermodel.updateOne({email: user[0].email}, user[0])
	// 	return currentUser[0]
	// }

	// getUserPosts = async (id:any) => {
	// 	const posts = await postmodel.find({user_id: id})
	// 	return posts
	// }

	// getFriends = async (email:any) => {
	// 	const user:any = await usermodel.find({email: email})	
	// 	const friendsIdList = user[0].friends
	// 	let friends = []
	// 	for (let i = 0; i < friendsIdList.length; i++) {
	// 		let friend = await usermodel.findById(mongoose.Types.ObjectId(friendsIdList[i]))
	// 		friends.push(friend)
	// 	}
	// 	return friends
		
	// }

	// updateProfile = async (body:any) => {
	// 	return usermodel.updateOne({email: body.email}, {
	// 		profile: body.profile,
	// 		firstname: body.firstname,
	// 		secondname: body.secondname,
	// 		avatar: body.avatar
	// 	})
	// 		.then(result => 'user updated')
	// 		.catch(err => err.message)
	// }

	// getChats = async (email:any) => {
	// 	const user:any = await usermodel.find({email})
	// 	const chatsIdList = [...user[0].chats]
	// 	let chatUsersInfo = []
	// 	let chats = []
	// 	let chatUser:any = []
	// 	for (let i = 0; i < chatsIdList.length; i++) {
	// 		let chat:any = await chatmodel.findById(mongoose.Types.ObjectId(chatsIdList[i]))
	// 		if (user[0]._id.toString() === chat.current_user_id.toString()) {
	// 			chatUser = await usermodel.findById(mongoose.Types.ObjectId(chat.chat_user_id))
	// 		} else {
	// 			chatUser = await usermodel.findById(mongoose.Types.ObjectId(chat.current_user_id))
	// 		}
	// 		chats.push(chat)
	// 		chatUsersInfo.push(chatUser)
	// 	}
	// 	return {chatUsersInfo, chats}
	// }

	// getUsers = async (current_user:any) => {
	// 	const allUsers = await usermodel.find( { email: { $nin: current_user } } )
	// 	return allUsers
	// }

	// addChat = async (body:any, current_user:any) => {
	// 	const chatUser:any = await usermodel.find({email: body.chat_user})
	// 	const currentUser:any = await usermodel.find({email: current_user})
	// 	const commonChat = currentUser[0].chats.filter((chat:any) => chatUser[0].chats.indexOf(chat) >= 0)
	// 	const newChat:any = await chatmodel.create({
	// 		chat_user_id: mongoose.Types.ObjectId(chatUser[0]._id),
	// 		current_user_id: mongoose.Types.ObjectId(currentUser[0]._id)
	// 	})
		
	// 	chatUser[0].chats.push(newChat)
	// 	currentUser[0].chats.push(newChat)
	// 	await usermodel.updateOne({email: current_user}, currentUser[0])
	// 	await usermodel.updateOne({email: body.chat_user}, chatUser[0])
	// 	console.log(currentUser[0])
	// 	return {msg: 'new chat created', current_user: currentUser[0]}
	// }

	// addFriend = async (user_id:any, current_user:any) => {
	// 	const currentUser:any = await usermodel.find({email: current_user})
	// 	const user:any = await usermodel.find({_id: user_id.id})
	// 	currentUser[0].friends.push(user[0]._id)
	// 	user[0].friends.push(currentUser[0]._id)
	// 	await usermodel.updateOne({email: current_user}, currentUser[0])
	// 	await usermodel.updateOne({email: user[0].email}, user[0])
	// 	return currentUser[0]
	// }

	// getAllPosts = async (current_user:any) => {
	// 	const user = await usermodel.find({email: current_user})
	// 	const allPosts = await postmodel.find({user_id: { $nin: user[0]._id }})
	// 	return allPosts
	// }

	// changeLike = async (post:any, current_user:any) => {
	// 	await postmodel.updateOne({_id: post._id}, post)
	// 	return 'ok'
	// }

	// getPostComments = async (postId:any) => {
	// 	const post:any = await postmodel.find({_id: postId})
	// 	let comments:any = []
	// 	post[0].comments.map(async (commentId:any) => {
	// 		const comment = await commentmodel.find({_id: commentId})
	// 		comments.push(comment[0])
	// 	})
	// 	return comments
	// }

	// getUserProfile = async (profileId:any) => {
	// 	const profile = await usermodel.find({_id: profileId})
	// 	console.log(profile)
	// 	return profile[0]
	// }
};


export const usersService = new UsersService();
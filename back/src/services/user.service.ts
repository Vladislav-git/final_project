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
			return token
		}
	}

	addPost = async (body:any) => {
		const post:any = await postmodel.create({
			user_id: mongoose.Types.ObjectId(body.user_id),
			post_text: body.post_text,
			post_img: body.post_img,
			post_video: body.post_video,
		})
		return 'post saved'
	}

	addComment = async (body:any) => {
		await commentmodel.create({
			user_id: mongoose.Types.ObjectId(body.user_id),
			post_id: mongoose.Types.ObjectId(body.post_id),
			comment_text: 'String',
			comment_img: 'String',
			comment_video: 'String',
		})
		return 'comment created'
	}

	getPosts = async () => {
		const posts = await postmodel.find()
		return posts
	}

	getFriends = async (email:any) => {
		const user:any = await usermodel.find({email: email})	
		const friendsIdList = user[0].friends
		let friends = []
		for (let i = 0; i < friendsIdList.length; i++) {
			let friend = await usermodel.findById(mongoose.Types.ObjectId(friendsIdList[i]))
			friends.push(friend)
		}
		return friends
		
	}

	updateProfile = async (body:any) => {
		return usermodel.updateOne({email: body.email}, {
			profile: body.profile,
			firstname: body.firstname,
			secondname: body.secondname,
			avatar: body.avatar
		})
			.then(result => 'user updated')
			.catch(err => err.message)
	}

	getChats = async (email:any) => {
		const user:any = await usermodel.find({email})
		const chatsIdList = [...user[0].chats]
		console.log(chatsIdList)
		let chatUsersInfo = []
		let chats = []
		for (let i = 0; i < chatsIdList.length; i++) {
			let chat:any = await chatmodel.findById(mongoose.Types.ObjectId(chatsIdList[i]))
			let chatUser:any = await usermodel.findById(mongoose.Types.ObjectId(chat.user_id))
			chats.push(chat)
			chatUsersInfo.push(chatUser)
		}
		return {chatUsersInfo, chats}
	}

	addChat = async (body:any, email:any) => {
		const chatUser:any = await usermodel.find({email: body.body})
		const newChat:any = await chatmodel.create({
			user_id: mongoose.Types.ObjectId(chatUser[0]._id)
		})
		const user:any = await usermodel.find({email})
		user[0].chats.push(newChat)
		await usermodel.updateOne({email}, user[0])
		return 'new chat created'
	}

};


export const usersService = new UsersService();
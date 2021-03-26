import mongoose from 'mongoose';
import {usermodel, postmodel, commentmodel, chatmodel, messagemodel} from '../db_models/user.db_model'

interface S {
	current_user: string
}

interface SS {
	user_id: string,
	current_user:string
}

interface CC {
	chat_user: string,
	current_user: string
}

interface Body {
	body: PostInfo
}

interface Post {
	post: PostInfo
}

interface User {
	profile: Profile
}

interface Profile {
	_id: string,
    firstname: string,
    secondname: string,
    email: string,
    password: string,
    created_date: string,
    profile: ProfileData,
    friends: Array<string>,
    images: Array<string>,
    videos: Array<string>,
    avatar: string,
    chats: Array<string>
}

interface ProfileData {
    gender: string,
    birth_date: string,
    city: string,
    phone_number: string,
}

interface ProfileId {
	profileId: string
}

interface PostId {
	postId: string
}

interface PostInfo {
	_id: string,
	user_name: string,
    user_img: string,
    user_id: string,
    post_text: string,
    post_img: string,
    post_video: string,
    like_number: Number,
    who_liked: Array<string>,
    comments: Array<string>,
    comment_number: Number
}



interface Id {
	id: string
}

interface Email {
	email: string
}

const Query = {
    getAllPosts: async (root:any,{current_user}:S) => {
		try {
			const user = await usermodel.find({email: current_user})
			const allPosts = await postmodel.find({user_id: { $nin: user[0]._id }})
			return allPosts
		}
		catch(e) {
			return e
		}
    },
    getUserPosts: async (root:any,{id}:Id) => {
		try {
			const posts = await postmodel.find({user_id: id})
			return posts
		}
		catch(e) {
			return e
		}
    },
    getFriends: async (root:any, {email}:Email) => {
		try {
			const user:any = await usermodel.find({email: email})	
			const friendsIdList = user[0].friends
			let friends = []
			for (let i = 0; i < friendsIdList.length; i++) {
				let friend = await usermodel.findById(mongoose.Types.ObjectId(friendsIdList[i]))
				friends.push(friend)
			}
			return friends
		}
		catch(e) {
			return e
		}
    },

    getChats: async (root:any, {email}:Email) => {
		try {
			const user:any = await usermodel.find({email})
			const chatsIdList = [...user[0].chats]
			let chatUsersInfo = []
			let chats = []
			let chatUser:any = []
			for (let i = 0; i < chatsIdList.length; i++) {
				let chat:any = await chatmodel.findById(mongoose.Types.ObjectId(chatsIdList[i]))
				if (user[0]._id.toString() === chat.current_user_id.toString()) {
					chatUser = await usermodel.findById(mongoose.Types.ObjectId(chat.chat_user_id))
				} else {
					chatUser = await usermodel.findById(mongoose.Types.ObjectId(chat.current_user_id))
				}
				chats.push(chat)
				chatUsersInfo.push(chatUser)
			}
			return {chatUsersInfo, chats}
		}
		catch(e) {
			return e
		}
	},

    getUsers: async (root:any, {current_user}:S) => {
		try {
			const allUsers = await usermodel.find( { email: { $nin: current_user } } )
			return allUsers
		}
		catch(e) {
			return e
		}
	},

    getPostComments: async (root:any, {postId}:PostId) => {
		try {
			const post:any = await postmodel.find({_id: postId})
			let comments:any = []
			post[0].comments.map(async (commentId:any) => {
				const comment = await commentmodel.find({_id: commentId})
				comments.push(comment[0])
			})
			return comments
		}
		catch(e) {
			return e
		}
	},

    getUserProfile: async (root:any, {profileId}:ProfileId) => {
		try {
			const profile = await usermodel.find({_id: profileId})
			return profile[0]
		}
		catch(e) {
			return e
		}
	}
}

const Mutation = {
    updateProfile: async (root:any, {profile}:User) => {
		try {
			await usermodel.updateOne({email: profile.email}, {
				profile: profile.profile,
				firstname: profile.firstname,
				secondname: profile.secondname,
				avatar: profile.avatar
			})
			const updatedUser = await usermodel.find({email: profile.email})
			return {msg: 'ok'}
		}
		catch(e) {
			return e
		}
	},
    addPost: async (root:any, {body}:Body) => {
		try {
			const post:any = await postmodel.create({
				user_name: body.user_name,
				user_img: body.user_img,
				user_id: mongoose.Types.ObjectId(body.user_id),
				post_text: body.post_text,
				post_img: body.post_img,
				post_video: body.post_video,
				like_number: body.like_number,
				who_liked: body.who_liked,
				comments: body.comments,
				comment_number: body.comment_number
			})
			return {msg: 'post saved'}
		}
		catch(e) {
			return e
		}
	},

    addChat: async (root:any, {chat_user, current_user}:CC) => {
		try {
			const chatUser:any = await usermodel.find({email: chat_user})
			const currentUser:any = await usermodel.find({email: current_user})
			const commonChat = currentUser[0].chats.filter((chat:any) => chatUser[0].chats.indexOf(chat) >= 0)
			const newChat:any = await chatmodel.create({
				chat_user_id: mongoose.Types.ObjectId(chatUser[0]._id),
				current_user_id: mongoose.Types.ObjectId(currentUser[0]._id)
			})
			
			chatUser[0].chats.push(newChat)
			currentUser[0].chats.push(newChat)
			await usermodel.updateOne({email: current_user}, currentUser[0])
			await usermodel.updateOne({email: chat_user}, chatUser[0])
			return {msg: 'new chat created', current_user: currentUser[0]}
		}
		catch(e) {
			return e
		}
	},

    addFriend: async (root:any, {user_id, current_user}:SS) => {
		try {
			const currentUser:any = await usermodel.find({email: current_user})
			const user:any = await usermodel.find({_id: user_id})
			currentUser[0].friends.push(user[0]._id)
			user[0].friends.push(currentUser[0]._id)
			await usermodel.updateOne({email: current_user}, currentUser[0])
			await usermodel.updateOne({email: user[0].email}, user[0])
			return currentUser[0]
		}
		catch(e) {
			return e
		}
	},

    changeLike: async (root:any, {post}:Post) => {
		try {
			await postmodel.updateOne({_id: post._id}, post)
			return {msg: 'ok'}
		}
		catch(e) {
			return e
		}
	},

    removeFriend: async (root:any, {user_id, current_user}:SS) => {
		try {
			const currentUser:any = await usermodel.find({email: current_user})
			const user:any = await usermodel.find({_id: user_id})
			const indexC:any = currentUser[0].friends.findIndex((item:any) => mongoose.Types.ObjectId(item) === mongoose.Types.ObjectId(user[0]._id))
			const indexU:any = user[0].friends.findIndex((item:any) => mongoose.Types.ObjectId(item) === mongoose.Types.ObjectId(currentUser[0]._id))
			currentUser[0].friends.splice(indexC, 1)
			user[0].friends.splice(indexU, 1)
			await usermodel.updateOne({email: current_user}, currentUser[0])
			await usermodel.updateOne({email: user[0].email}, user[0])
			return currentUser[0]
		}
		catch(e) {
			return e
		}
	}
}

export {Query, Mutation}
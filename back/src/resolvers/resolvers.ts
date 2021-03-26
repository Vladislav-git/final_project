import mongoose from 'mongoose';
import {usermodel, postmodel, commentmodel, chatmodel, messagemodel} from '../db_models/user.db_model'

const Query = {
    getAllPosts: async (root:any,{current_user}:any) => {
        const user = await usermodel.find({email: current_user})
        const allPosts = await postmodel.find({user_id: { $nin: user[0]._id }})
        return allPosts
    },
    getUserPosts: async (root:any,{id}:any) => {
        const posts = await postmodel.find({user_id: id})
        return posts
    },
    getFriends: async (root:any, {email}:any) => {
		const user:any = await usermodel.find({email: email})	
		const friendsIdList = user[0].friends
		let friends = []
		for (let i = 0; i < friendsIdList.length; i++) {
			let friend = await usermodel.findById(mongoose.Types.ObjectId(friendsIdList[i]))
			friends.push(friend)
		}
		return friends
    },

    getChats: async (root:any, {email}:any) => {
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
	},

    getUsers: async (root:any, {current_user}:any) => {
		const allUsers = await usermodel.find( { email: { $nin: current_user } } )
		return allUsers
	},

    getPostComments: async (root:any, {postId}:any) => {
		const post:any = await postmodel.find({_id: postId})
		let comments:any = []
		post[0].comments.map(async (commentId:any) => {
			const comment = await commentmodel.find({_id: commentId})
			comments.push(comment[0])
		})
		return comments
	},

    getUserProfile: async (root:any, {profileId}:any) => {
		const profile = await usermodel.find({_id: profileId})
		return profile[0]
	}
}

const Mutation = {
    updateProfile: async (root:any, {profile}:any) => {
		await usermodel.updateOne({email: profile.email}, {
			profile: profile.profile,
			firstname: profile.firstname,
			secondname: profile.secondname,
			avatar: profile.avatar
		})
        const updatedUser = await usermodel.find({email: profile.email})
        return {msg: 'ok'}
	},
    addPost: async (root:any, {body}:any) => {
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
	},

    addChat: async (root:any, {body, current_user}:any) => {
		const chatUser:any = await usermodel.find({email: body.chat_user})
		const currentUser:any = await usermodel.find({email: current_user})
		const commonChat = currentUser[0].chats.filter((chat:any) => chatUser[0].chats.indexOf(chat) >= 0)
		const newChat:any = await chatmodel.create({
			chat_user_id: mongoose.Types.ObjectId(chatUser[0]._id),
			current_user_id: mongoose.Types.ObjectId(currentUser[0]._id)
	})
		
		chatUser[0].chats.push(newChat)
		currentUser[0].chats.push(newChat)
		await usermodel.updateOne({email: current_user}, currentUser[0])
		await usermodel.updateOne({email: body.chat_user}, chatUser[0])
		return {msg: 'new chat created', current_user: currentUser[0]}
	},

    addFriend: async (root:any, {user_id, current_user}:any) => {
		const currentUser:any = await usermodel.find({email: current_user})
		const user:any = await usermodel.find({_id: user_id})
		currentUser[0].friends.push(user[0]._id)
		user[0].friends.push(currentUser[0]._id)
		await usermodel.updateOne({email: current_user}, currentUser[0])
		await usermodel.updateOne({email: user[0].email}, user[0])
		return currentUser[0]
	},

    changeLike: async (root:any, {post}:any) => {
		await postmodel.updateOne({_id: post._id}, post)
		return {msg: 'ok'}
	},

    removeFriend: async (root:any, {user_id, current_user}:any) => {
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
}

export {Query, Mutation}
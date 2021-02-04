const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import mongoose from 'mongoose';
import {usermodel, postmodel, commentmodel} from '../db_models/user.db_model'

class UsersService {

	login = async (body:any) => {
		const user:any = await usermodel.find({email: body.email})
		if (user[0] === undefined) {
			return 'no such user'
		} else {
			if (bcrypt.compareSync(body.password, user[0].password) === true) {
				const token = jwt.sign(body.email, 'somesecretkey');
				return {token, user}
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
					gender: 'choose gender',
					birth_date: 'choose birth date',
					city: 'choose city',
					phone_number: 'choose phone number'
				}
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
		console.log(body)
		const post = await postmodel.create({
			user_id: mongoose.Types.ObjectId(body.user_id),
			post_text: body.post_text,
			post_img: body.post_img,
			post_video: body.post_video,
		})
		return 'ok'
	}

	addComment = async (body:any) => {
		console.log(body)
		await commentmodel.create({
			user_id: mongoose.Types.ObjectId(body.user_id),
			post_id: mongoose.Types.ObjectId(body.post_id),
			comment_text: 'String',
			comment_img: 'String',
			comment_video: 'String',
		})
		console.log(await postmodel.find())
		return 'ok1'
	}

	get = async (body:any) => {
		const user = await usermodel.find()
		return user
	}

};


export const usersService = new UsersService();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import {usermodel} from '../db_models/user.db_model'

class UsersService {

	login = async (body:any) => {
		const user:any = await usermodel.find({email: body.email})
		if (user[0] === undefined) {
			return 'no such user'
		} else {
			if (bcrypt.compareSync(body.password, user[0].password) === true) {
				const token = jwt.sign(body.email, 'somesecretkey');
				return token
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
				user_id: body.user_id})
			return 'user created'
		} else {
			return 'this email already exists'
		}
		
    }

};


export const usersService = new UsersService();
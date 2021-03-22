import mongoose from 'mongoose';
import {usermodel, postmodel, commentmodel, chatmodel, messagemodel} from '../db_models/user.db_model'

const Query = {
    getAllPosts: async (root:any,{current_user}:any) => {
        const user = await usermodel.find({email: current_user})
        const allPosts = await postmodel.find({user_id: { $nin: user[0]._id }})
        return allPosts
    },
}

const Mutation = {
    updateProfile: async (body:any) => {
		await usermodel.updateOne({email: body.email}, {
			profile: body.profile,
			firstname: body.firstname,
			secondname: body.secondname,
			avatar: body.avatar
		})
        const updatedUser = await usermodel.find({email: body.email})
        return updatedUser
	}
}

export {Query, Mutation}
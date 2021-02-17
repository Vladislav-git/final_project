import mongoose from 'mongoose';
import {usermodel, postmodel, commentmodel, chatmodel, messagemodel} from '../db_models/user.db_model'


const Socket = (io:any) => {
    io.on('connection', (client:any) => {
        client.on('msg', async (msg:any) => {
            await messagemodel.create({
                user_id: msg.id,
                chat_id: msg.current_chat[0]._id,
                message_text: msg.message,
                message_img: '',
                created_date: (new Date()).toString()
            })
        })
        client.on('get-messages', async(msg:any) => {
            const userMessages:any = await messagemodel.find({chat_id: msg.chat_id, user_id: msg.user_id})
            const chatUserMessages:any = await messagemodel.find({chat_id: msg.chat_id, user_id: msg.chat})
            const allChats = userMessages.concat(chatUserMessages)
            const chatUserData:any = await usermodel.find({_id: msg.chat_user})
            client.emit('get-messages', {allChats, chatUserInfo: {firstname: chatUserData[0].firstname, secondname: chatUserData[0].secondname, avatar: chatUserData[0].avatar}})
        })
      })
}

export default Socket;
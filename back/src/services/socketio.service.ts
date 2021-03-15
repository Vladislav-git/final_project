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
                created_date: (Date.now()).toString()
            })
        })
        client.on('get-messages', async(msg:any) => {
            const userMessages:any = await messagemodel.find({chat_id: msg.chat_id, user_id: msg.user_id})
            const chatUserMessages:any = await messagemodel.find({chat_id: msg.chat_id, user_id: msg.chat_user})
            const allMessages = userMessages.concat(chatUserMessages).sort((message1:any, message2:any) => Number(message1.created_date) > Number(message2.created_date) ? 1 : -1)
            const chatUserData:any = await usermodel.find({_id: msg.chat_user})
            console.log(chatUserMessages, userMessages, allMessages)
            client.emit('get-messages', {allMessages, chatUserInfo: {firstname: chatUserData[0].firstname, secondname: chatUserData[0].secondname, avatar: chatUserData[0].avatar}})
        })
      })
}

export default Socket;
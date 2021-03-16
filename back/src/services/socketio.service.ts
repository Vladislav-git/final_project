import mongoose from 'mongoose';
import {usermodel, postmodel, commentmodel, chatmodel, messagemodel} from '../db_models/user.db_model'


const Socket = (io:any) => {
    io.on('connection', (client:any) => {
        client.on('msg', async (msg:any) => {
            await messagemodel.create({
                user_id: msg.id,
                chat_id: msg.current_chat[0]._id,
                message_text: msg.message.message_text,
                message_img: msg.message.message_img,
                message_video: msg.message.message_video,
                created_date: (Date.now()).toString()
            })
        })
        client.on('get-messages', async(msg:any) => {
            const userMessages:any = await messagemodel.find({chat_id: msg.chat_id, user_id: msg.user_id})
            const chatUserMessages:any = await messagemodel.find({chat_id: msg.chat_id, user_id: msg.chat_user})
            const allMessages = userMessages.concat(chatUserMessages).sort((message1:any, message2:any) => Number(message1.created_date) > Number(message2.created_date) ? 1 : -1)
            const chatUserData:any = await usermodel.find({_id: msg.chat_user})
            client.emit('get-messages', {allMessages, chatUserInfo: {firstname: chatUserData[0].firstname, secondname: chatUserData[0].secondname, avatar: chatUserData[0].avatar}})
        })
        client.on('get-comments', async (postId:any) => {
            const allComments = await commentmodel.find({post_id: postId})
            client.emit('get-comments', allComments)
        })
        client.on('add-comment', async (comment:any) => {
            await commentmodel.create({
                user_id: comment.user_id,
                post_id: comment.post_id,
                comment_text: comment.comment_text,
                comment_img: comment.comment_img,
                comment_video: comment.comment_video,
                created_date: (Date.now()).toString()
            })
            const allComments = await commentmodel.find({post_id: comment.post_id})
            const post:any = await postmodel.find({_id: comment.post_id})
            post[0].comments = allComments
            post[0].comment_number += 1
            await postmodel.updateOne({post_id: comment.post_id}, post[0])
            client.emit('add-comment', post[0])
        })
      })
}

export default Socket;
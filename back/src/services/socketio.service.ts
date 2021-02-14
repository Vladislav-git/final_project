import mongoose from 'mongoose';
import {usermodel, postmodel, commentmodel, chatmodel, messagemodel} from '../db_models/user.db_model'


const Socket = (io:any) => {
    io.on('connection', (client:any) => {
        client.on('msg', async (msg:any) => {
            // console.log(msg)
            await messagemodel.create({
                user_id: msg.id,
                chat_id: msg.current_chat[0]._id,
                message_text: '',
                message_img: '',
            })
        })
        client.on('get-messages', async(msg:any) => {
            console.log(msg)
            client.emit('get-messages', 'ok')
        })
      })
}

export default Socket;
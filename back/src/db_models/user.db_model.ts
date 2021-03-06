import mongoose from 'mongoose';
const { Schema } = mongoose;

mongoose.connect("mongodb+srv://User:1234@cluster0.ynhcg.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

const commentSchema = new Schema ({
    user_id: {type: Schema.Types.ObjectId, ref: 'users'},
    post_id: {type: Schema.Types.ObjectId, ref: 'posts'},
    comment_text: String,
    comment_img: String,
    comment_video: String,
})

const postShema = new Schema ({
    user_id: {type: Schema.Types.ObjectId, ref: 'users'},
    post_text: String,
    post_img: String,
    post_video: String,
})

const userShema = new Schema ({
    firstname: String,
    secondname: String,
    email: String,
    password: String,
    created_date: String,
    profile: Object,
    friends: Array,
    images: Array,
    videos: Array,
    avatar: String,
    chats: [{type: Schema.Types.ObjectId, ref: 'chats'}]
})

const chatShema = new Schema({
    chat_user_id: {type: Schema.Types.ObjectId, ref: 'users'},
    current_user_id: {type: Schema.Types.ObjectId, ref: 'users'}
})

const messageShema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'users'},
    chat_id: {type: Schema.Types.ObjectId, ref: 'chats'},
    message_text: String,
    message_img: String,
    message_video: String,
    created_date: String
})

export const usermodel = mongoose.model('users', userShema)
export const postmodel = mongoose.model('posts', postShema)
export const commentmodel = mongoose.model('comments', commentSchema)
export const chatmodel = mongoose.model('chats', chatShema)
export const messagemodel = mongoose.model('messages', messageShema)

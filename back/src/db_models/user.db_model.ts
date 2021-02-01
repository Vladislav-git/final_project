import mongoose from 'mongoose';
const { Schema } = mongoose;

mongoose.connect("mongodb+srv://User:1234@cluster0.ynhcg.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

const userShema = new Schema ({
    firstname: String,
    secondname: String,
    email: String,
    password: String,
    created_date: String,
    user_id: String
})

export const usermodel = mongoose.model('Users', userShema)

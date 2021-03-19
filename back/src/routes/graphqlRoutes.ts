import {controller} from '../controllers/user.controller'
import express from 'express';
import auth from '../middlewares/auth.middleware'
const graphqlRouter = express.Router();



export default graphqlRouter
    .get('/get-all-posts', auth, controller.getAllPosts)
    .get('/get-friends', auth, controller.getFriends)
    .get('/get-user-posts/:id', auth, controller.getUserPosts)
    .get('/get-chats', auth, controller.getChats)
    .get('/get-users', auth, controller.getUsers)
    .get('/get-user-profile/:id', auth, controller.getUserProfile)
    .get('/get-post-comments/:id', auth, controller.getPostComments)
    .post('/add-post', auth, controller.addPost)
    .post('/add-comment', auth, controller.addComment)
    .post('/add-photo', auth, controller.addPhoto)
    .post('/add-chat', auth, controller.addChat)
    .put('/add-friend', auth, controller.addFriend)
    .put('/remove-friend', auth, controller.removeFriend)
    .put('/update-profile', auth, controller.updateProfile)
    .put('/change-like', auth, controller.changeLike)
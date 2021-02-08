import {controller} from '../controllers/user.controller'
import express from 'express';
import {registerValidate, loginValidate} from '../middlewares/user.validation.middleware'
import auth from '../middlewares/auth.middleware'
const router = express.Router();



export default router
    // .get('/login',)
    // .get('/register',)
    // .get('/', controller.get)
    .get('/profile', auth)
    .get('/get-posts', controller.getPosts)
    .post('/login', loginValidate, controller.login)
    .post('/register', registerValidate, controller.register)
    .post('/google', loginValidate, controller.google)
    .post('/add-post', controller.addPost)
    .post('/add-comment', controller.addComment)
    .post('/add-photo', auth, controller.addPhoto)
    .put('/update-profile', auth, controller.updateProfile)




import {controller} from '../controllers/user.controller'
import express from 'express';
import {registerValidate, loginValidate} from '../middlewares/user.validation.middleware'
const router = express.Router();



export default router
    // .get('/login',)
    // .get('/register',)

    .post('/login', loginValidate, controller.login)
    .post('/register', registerValidate, controller.register)
    .post('/google', loginValidate, controller.google)




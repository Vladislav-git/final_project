import {controller} from '../controllers/user.controller'
import express from 'express';
import validate from '../middlewares/user.validation.middleware'
const router = express.Router();



export default router
    // .get('/login',)
    // .get('/register',)

    .post('/login', controller.login)
    .post('/register', validate,controller.register)
    .get('/google', (req, res) => res.send(1))
    .get('/google/redirect', () => console.log(1))




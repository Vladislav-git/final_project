const jwt = require('jsonwebtoken');

import {usermodel} from '../db_models/user.db_model'



const auth = async (req:any, res:any, next:any) => {
        const token = req.headers['authorization'].split(' ')['1'];
        const result = jwt.verify(token, 'somesecretkey');
        req.online = result
        return usermodel.findOne({where:{email:result}})
            .then((data: any) => next())
            .catch((err: any) => res.send(err.message))

};

export default auth;
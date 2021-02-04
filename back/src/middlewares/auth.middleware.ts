const jwt = require('jsonwebtoken');

const usersmodel = require('../db_models/user.db_model');



const auth = async (req:any, res:any, next:any) => {
        const token = req.headers['authorization'].split(' ')['1'];
        const result = jwt.verify(token, 'somesecretkey');
        console.log(result)
        //
        // return usersmodel.user.findOne({where:{email:result.}})
        //     .then(data => {
        //         req.login = result.login;
        //         next();
        //     })
        //     .catch(err => err.message)

};

export default auth;
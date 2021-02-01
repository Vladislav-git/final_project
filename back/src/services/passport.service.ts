const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const jwt = require('jsonwebtoken');
import {usermodel} from '../db_models/user.db_model'



passport.serializeUser(function(user:any, done:any) {
    done(null, user);
  });


passport.deserializeUser((id:any, done:any) => {
    done(null, id)
})


passport.use(
    new GoogleStrategy({
        clientID: '933995381178-e1mo4pk5uks75i9q68e1v32t5bjq4sen.apps.googleusercontent.com',
        // clientSecret: 'Bwc8aLc7rB7vyknqG1Bi8MNy',
        callbackURL: "/google/redirect"
    }, (accessToken:any, refreshToken:any, profile:any, done:any) => {
        usermodel.find({email: profile._json.email})
            .then((user:any) => {
                if (user[0] === undefined) {
                    done(null, false,{message:'no such user'}) 
                } else {
                    const token = jwt.sign(profile._json.email, 'somesecretkey');
                    done(null, token)
                }
            })
        
        
    })
)
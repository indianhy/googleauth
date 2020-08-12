const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/user')

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID : '620049675920-52hh0ole1hlicl32ccblea5agfijbo3d.apps.googleusercontent.com',
        clientSecret:'UF8QpBcZvafdJfqODQxO-DFt',
        callbackURL:'/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        const newUser = {
            googleId: profile.id,
            name : profile.displayName, 
            image: profile.photos[0].value
        }

        try{
            let user = await User.findOne({googleId:profile.id})

            if(user){
                done(null,user)
            }
            else{
                user = await User.create(newUser)
                done(null,user)
            }

        }catch(error){
            console.log(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}
const passport = require('passport')
const {Strategy} = require('passport-google-oauth20')
const express = require('express')
const {setUserId} = require('./services')
const {addNewUser} = require('./task.model')
const cookieSession = require('cookie-session')
require('dotenv').config()

const app = express()
app.use(express.json())
const config ={
    CLIENT_ID : process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET, 
    COOKIE_KEY1 : process.env.COOKIE_KEY1,
    COOKIE_KEY2 : process.env.COOKIE_KEY2,
}

const AUTH_OPTIONS = {
    callbackURL : '/auth/google/callback',
    clientID : config.CLIENT_ID,
    clientSecret : config.CLIENT_SECRET,
}

async function verifyCallBack(accessToken, refreshToken, profile, done){
    console.log(accessToken+" "+refreshToken)
    console.log(profile)
    setUserId(profile.id)
   await addNewUser(profile.id)
   done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallBack)) 

//save the session from the cookie+
passport.serializeUser((user, done) =>{
    console.log(" inside the serialize user "+user)
    done(null, user.id)
})


//read the session from the cookie
passport.deserializeUser((id, done) =>{
    done(null, id)
})

app.use(cookieSession({
    name: 'session',
    maxAge : 24*60*60*1000,
    keys : [config.COOKIE_KEY1, config.COOKIE_KEY2,],
}))

app.use(passport.initialize())    //initializing the passport
app.use(passport.session())

function checkLoggedIn(req, res, next){
     
    const isLoggedIn = req.isAuthenticated() && req.user 
    setUserId(req.user)
    
    // console.log(req.user+"comming request ueer name")
    // this.USER_ID = req.user
    //setTheValue(req.user)
    // console.log(this.USER_ID + "inside the checkloggedin")
 
    if(!isLoggedIn){
        return res.status(401).json({
            error : 'You mut log in!',
        })
    }
    next();
}

module.exports = {passport, checkLoggedIn, app}
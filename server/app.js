const https = require('https')
const fs = require('fs')
const path = require('path')
const helmet = require('helmet') 
const express = require('express')
const router = require('./router')
const passport = require('passport')
const cookieSession = require('cookie-session')
const {Strategy} = require('passport-google-oauth20')
const {mongoConnect} = require('./mongo')
const {setUserId} = require('./services')
const {addNewUser} = require('./task.model')
//const bodyParser = require('body-parser');

require('dotenv').config()

// var USER_ID = "guptaaayush95@gmail.com";

// function getUserId(){
//     return this.USER_ID;
// }
const PORT = 3000;

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


// function getUserId(){
    
//     // console.log(USER_ID+" inside getuserId")
//     return USER_ID;


// }

async function verifyCallBack(accessToken, refreshToken, profile, done){
     setUserId(profile.id)
    await addNewUser(profile.id)
    done(null, profile);
}

// Passport strategy are "local" for username and password-based authentication, "OAuth" for social media login, "JWT" for JSON web tokens
passport.use(new Strategy(AUTH_OPTIONS, verifyCallBack))  // strategy tells us what would be used to authenticate e.g would it be google , facebook or id : password



//save the session from the cookie
passport.serializeUser((user, done) =>{
    done(null, user.id)
})


//read the session from the cookie
passport.deserializeUser((id, done) =>{
    done(null, id)
})

const app = express();
app.use(express.json());

app.use(helmet())

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

app.get('/', (req , res) =>{
    return res.sendFile(path.join(__dirname, 'index.html'))
})


//app.use(urlencoded({extended : false}))
//app.use(json())

async function startmongo(){
   await mongoConnect()
}


async function serverStart(){
   await startmongo()
   https.createServer({
    key : fs.readFileSync('key.pem'),
    cert : fs.readFileSync('cert.pem')
   }, app).listen(PORT, (req, res)=>{
    console.log(`listening at the port ${PORT} `)
});
}

serverStart()

app.get('/auth/google', passport.authenticate('google',{
    scope : ['email'],
}))

app.get('/auth/google/callback', 
    passport.authenticate('google',{
       failureRedirect : '/failure',
        successRedirect: '/',
       session : true,
    }),
    (req, res) =>{
        console.log('Google called us back!')
    }
)

app.get('/failure', (req, res) =>{
  return  res.send('failed to log in! ')
})

app.get('/auth/logout', (req, res) =>{
    req.logOut()    // removes req.user and terminates any logged in session
    return res.redirect('/')
})

app.get('/tasks',  (req, res) =>{
    return res.send('index.html')
})
// app.post('/route', router );

/*app.get('/', (req, res) =>  {
    res.send("at the default router")
})*/
// function setTheValue(data){
     
// }


 app.use('/route', router);

 module.exports = {
    app, 
    
 }
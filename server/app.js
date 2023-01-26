const https = require('https')
const fs = require('fs')
const path = require('path')
const helmet = require('helmet') 
const express = require('express')
const router = require('./router')
const { checkLoggedIn, app} = require('./auth')
const {mongoConnect} = require('./mongo')

//const bodyParser = require('body-parser');

require('dotenv').config()


const PORT = 3000;



// const app = express();
app.use(express.json());

app.use(helmet())



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

// app.get('/tasks',  (req, res) =>{
//     return res.send('Success')
// })



 app.use('/route', checkLoggedIn, router);

 module.exports = {
    app, 
    
 }
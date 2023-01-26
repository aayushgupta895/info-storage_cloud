const mongoose = require('mongoose')



mongoose.connection.once('open', () =>{
    console.log('MongoDB connection is ready')
})

mongoose.connection.on('error', (err) =>{
    console.log(err)
})

async function mongoConnect(){
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    })
}

async function mongoDisconnect(){
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect, 
    mongoDisconnect,
}
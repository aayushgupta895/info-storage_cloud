const mongoose = require('mongoose')

const MONGO_URL = `mongodb+srv://task:pygg253@taskmanagercluster.g1y7af3.mongodb.net/?retryWrites=true&w=majority`

mongoose.connection.once('open', () =>{
    console.log('MongoDB connection is ready')
})

mongoose.connection.on('error', (err) =>{
    console.log(err)
})

async function mongoConnect(){
    await mongoose.connect(MONGO_URL, {
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
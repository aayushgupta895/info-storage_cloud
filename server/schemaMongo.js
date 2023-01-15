const mongoose = require('mongoose')



const  taskSchema = new mongoose.Schema({
        email_id : {
            type : Number,
            required : true,
        },
        info : [{
            title : {
                type : String,
               
            },
            desc : {
                type : String,
            
            }
        }],
    
})

var taskDatabase =     mongoose.model('NewTaskTable', taskSchema)
// const detailsTable =    mongoose.model('detailsSchema', details)

module.exports = {
  taskDatabase,
//   detailsTable,
}
// const { translateAliases } = require('./schemaMongo');
const {taskDatabase} = require('./schemaMongo')
const app = require('./app')
const {getUserId} = require('./services')

async function scheduleNewTask(task){
         
  const check_email = await taskDatabase.find({email_id : getUserId()})
  if(check_email)
    await taskDatabase.findOneAndUpdate(
        {email_id: getUserId()},
        {$addToSet: { info: {
        title : task.title,
        desc : task.desc,
        } }} ,
        {upsert : true, },
      )
    
          
}

async function addNewUser(){
    const newUser = new taskDatabase({
      email_id : getUserId()
    })
    await newUser.save()
}

async function allTask(res){
    //  console.log(getUserId()+" om all task")
      let tasks = await taskDatabase.findOne({email_id: getUserId()},{info : 1, _id : 0})
      res.status(200).json(tasks)
}

async function taskDelete(task){
    const taskDeleted =   await taskDatabase.findOneAndUpdate(
      {email_id: getUserId()},
      {$pull: { info: {
       title : task.title,
       desc : task.desc,
      } }} ,
       {upsert : true,},
     )
      return taskDeleted
}

module.exports = {scheduleNewTask, allTask, taskDelete, addNewUser}
const {scheduleNewTask, allTask, taskDelete} = require('./task.model')

async function showAllTask(req, res){
   await allTask(res)
}

async function postingTask(req, res){
       const task = req.body
       await scheduleNewTask(task)
       return res.status(201).json(task);
};

async function deleteTask(req, res){
     const task = req.body
     const deletedTask =   await taskDelete(task)
     res.status(202).send(deletedTask)
}

module.exports = {showAllTask, postingTask, deleteTask}
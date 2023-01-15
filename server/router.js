const passport = require('passport')

const express = require('express')
const { postingTask, showAllTask, deleteTask} = require('./controller')
const router = express.Router()

router.get('/rt1', (req, res)=>{
    res.send("heloo this is rt1")
})


router.post('/', postingTask);

router.get('/', showAllTask);

router.delete('/', deleteTask);

module.exports = router

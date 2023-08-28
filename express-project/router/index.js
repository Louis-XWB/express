const express = require('express')
const router = express.Router()
const videoRouter = require('./video')
const userRouter = require('./user')

router.use('/user', userRouter)
router.use('/video', videoRouter)

module.exports = router


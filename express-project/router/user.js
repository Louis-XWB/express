const express = require('express')
const userController = require('../controller/userController')
const userValidator = require('../middleware/validator/userValidator')
const { verifyToken } = require('../util/jwt')
const multer = require('multer')

const router = express.Router()

const upload = multer({
  dest: 'public/'
})

router
  .get('/getchannel/:userId',
    userController.getChannels)
  .get('/getsubscribes/:userId',
    userController.getSubscribes)
  .get('/getuser/:userId',
    verifyToken(false),
    userController.getUser)
  .get('/subscribe/:userId',
    verifyToken(),
    userController.subscribe)
  .get('/unsubscribe/:userId',
    verifyToken(),
    userController.unsubscribe)
  .post('/register',
    userValidator.register,
    userController.register)
  .post('/login',
    userValidator.login,
    userController.login)
  .get('/list', verifyToken(), userController.list)
  .put('/', verifyToken(), userValidator.update, userController.update)
  .post('/avatar', verifyToken(), upload.single('avatar'), userController.avatar)
  .delete('/delete', userController.delete)

module.exports = router


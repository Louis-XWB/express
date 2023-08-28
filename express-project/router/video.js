const express = require('express')
const router = express.Router()
const videoController = require('../controller/videoController')
const vodController = require('../controller/vodController')
const { verifyToken } = require('../util/jwt')
const { videovalidator } = require('../middleware/validator/videovalidator')


router
  .get('/gethots/:num', videoController.getHots)
  .get('/collect/:videoId', verifyToken(), videoController.collect)
  .get('/dislikelist', verifyToken(), videoController.dislikelist)
  .get('/likelist', verifyToken(), videoController.likelist)
  .get('/like/:videoId', verifyToken(), videoController.likevideo)
  .get('/dislike/:videoId', verifyToken(), videoController.dislikevideo)
  .delete('/comment/:videoId/:commentId', verifyToken(), videoController.deleteComment)
  .get('/commentlist/:videoId', verifyToken(), videoController.commentlist)
  .post('/comment/:videoId', verifyToken(), videoController.comment)
  .get('/videolist', videoController.videolist)
  .get('/video/:videoId', verifyToken(false), videoController.getVideo)
  .get('/getvod', verifyToken(), vodController.getVod)
  .post('/createvideo', verifyToken(), videovalidator, videoController.createVideo)

module.exports = router


const { User, Videocomment, Videolike, Subscribe, VideoCollection } = require('../model')
const { Video } = require('../model')
const { hotInc, topHots } = require('../model/redis/redishotsinc')

module.exports.getHots = async (req, res) => {
  const { num = 10 } = req.params
  const data = await topHots(num)
  res.status(200).json({ data })
}

module.exports.collect = async (req, res) => {
  const { videoId } = req.params
  const video = await Video.findById(videoId)
  if (!video) {
    return res.status(401).json({ error: 'video not found' })
  }

  const userId = req.user._id
  const collection = await VideoCollection.findOne({ user: userId, video: videoId })
  if (collection) {
    return res.status(401).json({ error: 'already collected' })
  }

  const collectionModel = new VideoCollection({ user: userId, video: videoId })
  await collectionModel.save()

  if (collectionModel) {
    await hotInc(videoId, 3)
  }

  res.status(201).json({ collectionModel })
}

module.exports.dislikelist = async (req, res) => {
  const { pageNum = 1, pageSize = 10 } = req.query
  const userId = req.user._id
  const likes = await Videolike.find({ user: userId, like: -1 })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ 'createdAt': -1 })
    .populate('video', '_id title')
    .populate('user', '_id username image')

  const likeCount = await Videolike.countDocuments({ user: userId })
  res.status(200).json({ likes, likeCount })
}

module.exports.likelist = async (req, res) => {
  const { pageNum = 1, pageSize = 10 } = req.query
  const userId = req.user._id
  const likes = await Videolike.find({ user: userId, like: 1 })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ 'createdAt': -1 })
    .populate('video', '_id title')
    .populate('user', '_id username image')

  const likeCount = await Videolike.countDocuments({ user: userId })
  res.status(200).json({ likes, likeCount })
}

module.exports.dislikevideo = async (req, res) => {
  const { videoId } = req.params
  const video = await Video.findById(videoId)
  if (!video) {
    return res.status(401).json({ error: 'video not found' })
  }

  const userId = req.user._id

  const like = await Videolike.findOne({ user: userId, video: videoId })
  if (like) {
    if (like.like === -1) {
      return res.status(401).json({ error: 'already disliked' })
    }

    like.like = -1
    await like.save()

    video.likeCount -= 1
    video.dislikeCount += 1
    await video.save()
  } else {
    const likeModel = new Videolike({ user: userId, video: videoId, like: -1 })
    await likeModel.save()

    video.dislikeCount += 1
    await video.save()
  }

  res.status(201).json({ ...video.toJSON(), like: -1 })
}

module.exports.likevideo = async (req, res) => {
  const { videoId } = req.params
  const video = await Video.findById(videoId)
  if (!video) {
    return res.status(401).json({ error: 'video not found' })
  }

  const userId = req.user._id

  const like = await Videolike.findOne({ user: userId, video: videoId })
  if (like) {
    if (like.like === 1) {
      return res.status(401).json({ error: 'already liked' })
    }

    like.like = 1
    await like.save()

    video.likeCount += 1
    video.dislikeCount -= 1
    await video.save()
    await hotInc(videoId, 2)
  } else {
    const likeModel = new Videolike({ user: userId, video: videoId, like: 1 })
    await likeModel.save()

    video.likeCount += 1
    await video.save()
    await hotInc(videoId, 2)
  }

  res.status(201).json({ ...video.toJSON(), like: 1 })
}

module.exports.deleteComment = async (req, res) => {
  const { videoId, commentId } = req.params
  const video = await Video.findById(videoId)
  if (!video) {
    return res.status(401).json({ error: 'video not found' })
  }

  const comment = await Videocomment.findById(commentId)
  if (!comment) {
    return res.status(401).json({ error: 'comment not found' })
  }

  if (!comment.video.equals(videoId)) {
    return res.status(401).json({ error: 'comment not found in video' })
  }

  if (!comment.user.equals(req.user._id)) {
    return res.status(401).json({ error: 'no permission' })
  }

  await comment.deleteOne()
  video.commentCount -= 1
  await video.save()
  res.status(200).json({ success: true })
}

module.exports.commentlist = async (req, res) => {
  const { videoId } = req.params

  const video = await Video.findById(videoId)

  if (!video) {
    return res.status(404).json({ error: 'video not found' })
  }

  const { pageNum = 1, pageSize = 10 } = req.query
  const comments = await Videocomment.find({ video: videoId })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ 'createdAt': -1 })
    .populate('user', '_id username image')

  const commentCount = video.commentCount
  res.status(200).json({ comments, commentCount })
}

module.exports.comment = async (req, res) => {
  const { videoId } = req.params
  const video = await Video.findById(videoId).populate('user', '_id username image')

  if (!video) {
    return res.status(404).json({ error: 'video not found' })
  }
  const comment = new Videocomment({
    content: req.body.content,
    user: req.user._id,
    video: videoId,
  })
  const dbBack = await comment.save()
  await hotInc(videoId, 2)

  video.commentCount += 1
  await video.save()

  const commentBack = dbBack.toJSON()
  res.status(201).json({ comment: commentBack })
}

module.exports.videolist = async (req, res) => {
  const { pageNum = 1, pageSize = 10 } = req.query
  const videos = await Video.find()
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ 'createdAt': -1 })
    .populate('user', '_id username image')

  const videoCount = await Video.countDocuments()
  res.status(200).json({ videos, videoCount })
}

module.exports.getVideo = async (req, res) => {
  const { videoId } = req.params
  let video = await Video.findById(videoId).populate('user', '_id username image')
  if (!video) {
    return res.status(404).json({ error: 'video not found' })
  }

  video = video.toJSON()
  video.isLike = false
  video.isDislike = false
  video.isSubscribe = false

  if (req.user) {
    const userId = req.user._id
    const like = await Videolike.findOne({ user: userId, video: videoId, like: 1 })
    if (like) {
      video.isLike = true
    }
    const dislike = await Videolike.findOne({ user: userId, video: videoId, like: -1 })
    if (dislike) {
      video.isDislike = true
    }

    const subscribe = await Subscribe.findOne({ user: userId, channel: video.user._id })
    if (subscribe) {
      video.isSubscribe = true
    }
  }

  await hotInc(videoId, 1)

  res.status(200).json({ video })
}

module.exports.createVideo = async (req, res) => {
  const id = req.user._id
  const body = { ...req.body, user: id }
  const videomodel = new Video(body);

  try {
    const dbBack = await videomodel.save();
    const video = dbBack.toJSON();
    res.status(201).send({ video });
  } catch (err) {
    res.status(500).send({ error: 'create video fail' })
  }
}
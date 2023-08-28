const { User, Subscribe } = require('../model')
const mongoose = require('mongoose')
const { createToken } = require('../util/jwt')
const fs = require('fs')
const { promisify } = require('util')
const rename = promisify(fs.rename)
const lodash = require('lodash')

module.exports.getChannels = async (req, res) => {
  console.log(req.method, '/user/getchannel')
  const { userId } = req.params
  const channelList = await Subscribe.find({ channel: userId })
    .populate('user', '_id username image subscribeCount cover channeldes')
  const userList = channelList.map(item => {
    return item.user.toJSON()
  })
  res.status(201).json({ userList })
}

module.exports.getSubscribes = async (req, res) => {
  const { userId } = req.params
  const subscribeList = await Subscribe.find({ user: userId })
    .populate('channel', '_id username image subscribeCount cover channeldes')
  const userList = subscribeList.map(item => {
    return item.channel.toJSON()
  })
  res.status(201).json({ userList })
}

module.exports.getUser = async (req, res) => {
  console.log(req.method, '/user/getuser')
  if (req.user) {
    const { userId } = req.params
    const subscribe = await Subscribe.findOne({ user: req.user._id, channel: userId })
    const isSubscribe = subscribe ? true : false
    if (isSubscribe) {
      const user = await User.findById(userId)
      res.status(200).json({
        ...lodash.pick(user, ['_id',
          'username',
          'image',
          'subscribeCount',
          'cover',
          'channeldes']), isSubscribe
      })
    } else {
      res.status(401).json({ error: 'not subscribed' })
    }
  } else {
    res.status(401).json({ error: 'not subscribed' })
  }
}

module.exports.subscribe = async (req, res) => {
  console.log(req.method, '/user/subscribe')
  const userId = req.user._id
  const { userId: subscribeId } = req.params
  if (userId === subscribeId) {
    return res.status(401).json({ error: 'can not subscribe yourself' })
  }

  const subscribe = await Subscribe.findOne({ user: userId, channel: subscribeId })
  if (!subscribe) {
    const subscribeModel = new Subscribe({ user: userId, channel: subscribeId })
    await subscribeModel.save()

    await User.findByIdAndUpdate(subscribeId, { $inc: { subscribeCount: 1 } })
    res.status(201).json({ success: true })
  } else {
    res.status(401).json({ error: 'already subscribed' })
  }
}

module.exports.unsubscribe = async (req, res) => {
  console.log(req.method, '/user/unsubscribe')
  const userId = req.user._id
  const { userId: subscribeId } = req.params

  let subscribe = null
  try {
    subscribe = await Subscribe.findOne({ user: userId, channel: subscribeId })
  } catch (err) {
    console.log(err)
  }

  console.log(userId)
  console.log(subscribeId)
  console.log(subscribe)
  if (subscribe) {
    await new Subscribe(subscribe).deleteOne()
    await User.findByIdAndUpdate(subscribeId, { $inc: { subscribeCount: -1 } })
    res.status(201).json({ success: true })
  } else {
    res.status(401).json({ error: 'not subscribed' })
  }
}

module.exports.register = async (req, res) => {
  console.log(req.method, '/user/register')
  console.log(req.body)

  const userModel = new User(req.body)
  const dbBack = await userModel.save()
  const user = dbBack.toJSON()
  delete user.password
  res.status(200).json({ user })
}

module.exports.login = async (req, res) => {
  console.log(req.method, '/user/login')
  const dbBack = await User.findOne(req.body)
  if (!dbBack) {
    return res.status(401).json({ error: 'user is not exist' })
  }

  const user = dbBack.toJSON()
  user.token = await createToken(user)
  res.status(200).send({ user })
}

module.exports.list = async (req, res) => {
  console.log(req.method, '/user/list')
  res.send('/user/list')
}

module.exports.update = async (req, res) => {
  console.log(req.method, '/user/update')
  const id = req.user._id
  const updateData = await User.findByIdAndUpdate(id, req.body, { new: true })
  console.log(updateData)
  res.status(202).json({ user: updateData })
}

module.exports.avatar = async (req, res) => {
  console.log(req.method, '/user/avatar')
  console.log(req.file)
  const originalname = req.file.originalname
  const fileArr = originalname.split('.')
  const ext = fileArr[fileArr.length - 1]
  const filename = req.file.filename + '.' + ext

  try {
    await rename(req.file.path, req.file.destination + filename)
    const id = req.user._id
    const updateData = await User.findByIdAndUpdate(id, { image: filename }, { new: true })
    console.log(updateData)
    res.status(202).json({ filepath: filename })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'upload fail' })
  }
}

module.exports.delete = async (req, res) => {
  console.log(req.method, '/user/delete')
  res.send('/user/delete')
}
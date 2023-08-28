const mongoose = require('mongoose')
const md5 = require('../util/md5')
const baseModel = require('./baseModel')
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
    set(val) {
      return md5(val)
    },
    select: false,
  },
  phone: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    default: null
  },
  age: {
    type: Number,
  },
  cover: {
    type: String,
    default: null
  },
  channeldes: {
    type: String,
    default: null
  },
  subscribeCount: {
    type: Number,
    default: 0
  },
  ...baseModel
})

module.exports = userSchema
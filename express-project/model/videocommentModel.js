const mongoose = require('mongoose')
const baseModel = require('./baseModel')
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Video',
  },
  ...baseModel
})

module.exports = commentSchema
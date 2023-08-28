const mongoose = require('mongoose')
const baseModel = require('./baseModel')
const collectionSchema = new mongoose.Schema({
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

module.exports = collectionSchema
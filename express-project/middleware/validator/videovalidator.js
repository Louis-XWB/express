const { body, validationResult } = require('express-validator')
const validator = require('./errorBack')
const { User } = require('../../model/index')

module.exports.videovalidator = validator([
  body('title')
    .notEmpty().withMessage('video title is required').bail()
    .isLength({ max: 20 }).withMessage('video title must be at most 20 characters long').bail(),


  body('vodvideoId')
    .notEmpty().withMessage('vodvideoId is required').bail()
])
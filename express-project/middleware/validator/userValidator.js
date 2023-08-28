const { body, validationResult } = require('express-validator')
const validator = require('./errorBack')
const { User } = require('../../model/index')


module.exports.register = validator([
  body('username')
    .notEmpty().withMessage('username is required').bail()
    .isLength({ min: 3 }).withMessage('username must be at least 3 characters long'),
  body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('email is invalid')
    .custom(async (value, { req }) => {
      await User.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject('E-mail already in use')
        }
      })
    })
    .bail(),
  body('phone')
    .notEmpty().withMessage('phone is required')
    .custom(async (value, { req }) => {
      await User.findOne({ phone: value }).then(user => {
        if (user) {
          return Promise.reject('Phone already in use')
        }
      })
    })
    .bail(),
  body('password')
    .notEmpty().withMessage('password is required')
    .isLength({ min: 6 }).withMessage('password must be at least 6 characters long')
    .bail(),
])

module.exports.login = validator([
  body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('email is invalid')
    .custom(async (value, { req }) => {
      await User.findOne({ email: value }).then(user => {
        if (!user) {
          return Promise.reject('E-mail is not registered')
        }
      })
    })
    .bail(),
  body('password')
    .notEmpty().withMessage('password is required')
    .isLength({ min: 6 }).withMessage('password must be at least 6 characters long')
    .bail(),
])

module.exports.update = validator([
  body('email')
    .custom(async (value, { req }) => {
      await User.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject('E-mail has been registered')
        }
      })
    })
    .bail(),
  body('username')
    .custom(async (value, { req }) => {
      await User.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject('Username has been registered')
        }
      })
    })
    .bail(),
  body('phone')
    .custom(async (value, { req }) => {
      await User.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject('Phone has been registered')
        }
      })
    })
    .bail(),
])
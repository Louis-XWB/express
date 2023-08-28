const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  console.log(req.method)
  res.send('/index')
})

router.get('/users', (req, res) => {
  console.log(req.method)
  res.send('/users')
})

module.exports = router


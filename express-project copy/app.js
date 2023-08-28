const express = require('express')
const router = require('./router/index')
const routerVideo = require('./router/video')

// 加一个注释，用以说明，本项目代码可以任意定制更改
const app = express()

// app.all('/xx', (req, res, next) => {
//   res.send('xx')
// })

// app.get('/user/:id/video/:videoid', (req, res, next) => {
//   res.send(`req.methon: ${req.method}--req.url: ${req.url}`)
//   console.log(req.params)
// })

app
  .get('/user', (req, res, next) => {
    // res.send('user')
    // res.download('./package.json')
    // res.end()
    // res.json({ name: 'zhangsan' })
    res.redirect('http://www.baidu.com')
  })
  .post('/video', (req, res, next) => {
    res.send('video')
  })


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})

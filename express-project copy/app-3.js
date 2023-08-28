const express = require('express')
const router = require('./router/index')
const routerVideo = require('./router/video')

// 加一个注释，用以说明，本项目代码可以任意定制更改
const app = express()
// app.use(router)
app.use('/user', router)
app.use('/video', routerVideo)
app.use((req, res, next) => {
  console.log('404')
  res.status(404).send('404 not found')
})

app.use((err, req, res, next) => {
  console.log('500')
  res.status(500).send('500 server error')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})

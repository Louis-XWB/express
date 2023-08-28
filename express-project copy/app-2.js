const express = require('express')

// 加一个注释，用以说明，本项目代码可以任意定制更改
const app = express()

const PORT = process.env.PORT || 3000

app.get('/user', (req, res,next) => {
  console.log('第一个回调函数')
  next()
},function(req,res){
  console.log('第二个回调函数')
  res.status(200).send('end')
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})

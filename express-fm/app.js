const express = require('express');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const db = require('./db.js');


const app = express();
// app.use(express.urlencoded())
app.use(express.json())


app.listen(3000, () => {
  console.log('Server listening on port 3000');
  console.log('Run http://localhost:3000 in your browser')
})

app.get('/', async function (req, res) {
  try {
    const data = await db.getDb();
    res.send(data.users);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
})

app.post('/', async (req, res) => {
  // console.log(req.headers)
  let body = req.body
  if (body) {
    const data = await db.getDb();
    if (data && data.users && data.users.length > 0) {
      let lastId = data.users[data.users.length - 1].id;
      body.id = lastId + 1;
      data.users.push(body)
      try {
        let resBody = await db.serverDb(data)
        res.status(200).send(resBody);
      } catch (e) {
        res.status(500).json({ error: err });
      }
    }
  } else {
    res.status(403).json({ error: 'No body' })
  }
})

app.put('/:id', async (req, res) => {
  let body = req.body
  if (body) {
    const data = await db.getDb();
    if (data && data.users && data.users.length > 0) {
      const userId = Number.parseInt(req.params.id)
      let index = data.users.findIndex(x => x.id === userId)
      if (index > -1) {
        const originalUser = data.users[index];
        originalUser.id = userId;
        originalUser.username = body.username? body.username : originalUser.username;
        originalUser.age = body.age? body.age : originalUser.age;
        data.users[index] = originalUser;
        try {
          await db.serverDb(data)
          res.status(200).send(originalUser);
        } catch (e) {
          res.status(500).json({ error: err });
        }
      } else {
        res.status(403).json({ error: 'User not found' })
      }
    }
  } else {
    res.status(403).json({ error: 'No body' })
  }
})

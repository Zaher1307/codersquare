const express = require('express')
const app = express()
const posts = require('./src/routes/posts')
const likes = require('./src/routes/likes')
const comments = require('./src/routes/comments')
const { initDatabase } = require('./src/models/models');

(async () => {
  await initDatabase()
})()

app.use(express.json())
app.use('/posts', posts)
app.use('/likes', likes)
app.use('/comments', comments)

app.listen(3000)

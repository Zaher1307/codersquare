const express = require('express')
const app = express()
const postsRoutes = require('./src/routes/posts')
const likesRoutes = require('./src/routes/likes')
const commentsRoutes = require('./src/routes/comments')
const { initDatabase } = require('./src/models/models');

(async () => {
  await initDatabase()
})()

app.use(express.json())
app.use('/posts', postsRoutes)
app.use('/likes', likesRoutes)
app.use('/comments', commentsRoutes)

app.listen(3000)

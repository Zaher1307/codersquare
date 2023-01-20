require('dotenv').config()
const express = require('express')
const app = express()
const postsRoutes = require('./src/routes/posts')
const likesRoutes = require('./src/routes/likes')
const commentsRoutes = require('./src/routes/comments')
const usersRoutes = require('./src/routes/users')
const { initDatabase } = require('./src/models/models')
const errMidlleware = require('./src/middlewares/errMiddleware')
const authMiddleware = require('./src/middlewares/authMiddleware')

;(async () => {
  await initDatabase()
})()

app.use(express.json())
app.use(authMiddleware)

app.use('/posts', postsRoutes)
app.use('/likes', likesRoutes)
app.use('/comments', commentsRoutes)
app.use('/users', usersRoutes)

app.use(errMidlleware)

app.listen(3000)

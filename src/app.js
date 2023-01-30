require('dotenv').config()
const cors = require('cors')
const express = require('express')
const postsRoutes = require('./routes/posts')
const likesRoutes = require('./routes/likes')
const commentsRoutes = require('./routes/comments')
const usersRoutes = require('./routes/users')
const errMidlleware = require('./middlewares/errMiddleware')
const authMiddleware = require('./middlewares/authMiddleware')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/users', usersRoutes)
app.use(authMiddleware)
app.use('/posts', postsRoutes)
app.use('/likes', likesRoutes)
app.use('/comments', commentsRoutes)
app.use(errMidlleware)

module.exports = app

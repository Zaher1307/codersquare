require('dotenv').config()
const cors = require('cors')
const express = require('express')
const postsRoutes = require('./src/routes/posts')
const likesRoutes = require('./src/routes/likes')
const commentsRoutes = require('./src/routes/comments')
const usersRoutes = require('./src/routes/users')
const { initDatabase } = require('./src/models/models')
const errMidlleware = require('./src/middlewares/errMiddleware')
const authMiddleware = require('./src/middlewares/authMiddleware')

const app = express()

;(async () => { await initDatabase() })()

app.use((req, res, next) => {
  console.log(req.get('host'))
  next()
})

app.use(cors())
app.use(express.json())
app.use('/users', usersRoutes)
app.use(authMiddleware)
app.use('/posts', postsRoutes)
app.use('/likes', likesRoutes)
app.use('/comments', commentsRoutes)
app.use(errMidlleware)

app.listen(3000)

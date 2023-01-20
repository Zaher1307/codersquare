const jwt = require('jsonwebtoken')
const { Like } = require('../models/models')

const deleteLikeMiddleware = async (request, response, next) => {
  const { authorization } = request.headers
  if (!authorization) {
    return response.status(401).send('Authorization token required')
  }

  const token = authorization.split(' ')[1]
  const { id } = await jwt.verify(token, process.env.SECRET)
  const { postId } = request.body
  const post = await Like.findOne({ where: { postId } })
  if (post.userId !== id) {
    return response.status(401).send('user is not authorized')
  }

  next()
}

module.exports = deleteLikeMiddleware

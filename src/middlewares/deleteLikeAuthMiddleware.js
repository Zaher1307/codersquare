const jwt = require('jsonwebtoken')
const { Like } = require('../models/index')
const responseSender = require('../utils/responseSender')

const deleteLikeMiddleware = async (request, response, next) => {
  const { authorization } = request.headers
  if (!authorization) {
    return responseSender(response, 401, 'Authorization token required')
  }

  const token = authorization.split(' ')[1]
  const { id } = await jwt.verify(token, process.env.SECRET)
  const { postId } = request.body
  const like = await Like.findOne({ where: { postId } })
  if (like.userId !== id) {
    return responseSender(response, 401, 'user is not authorized')
  }

  request.body.userId = id
  next()
}

module.exports = deleteLikeMiddleware

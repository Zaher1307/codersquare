const jwt = require('jsonwebtoken')
const { Post } = require('../models/index')
const responseSender = require('../utils/responseSender')

const deletePostMiddleware = async (request, response, next) => {
  const { authorization } = request.headers
  if (!authorization) {
    return responseSender(response, 401, 'Authorization token required')
  }

  const token = authorization.split(' ')[1]
  const { id } = await jwt.verify(token, process.env.SECRET)
  const postId = request.params.id
  const post = await Post.findOne({ where: { id: postId } })
  if (!post) {
    return responseSender(response, 401, 'post not found')
  }
  if (post.userId !== id) {
    return responseSender(response, 401, 'user is not authorized')
  }

  next()
}

module.exports = deletePostMiddleware

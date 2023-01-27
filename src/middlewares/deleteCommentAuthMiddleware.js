const jwt = require('jsonwebtoken')
const { Comment } = require('../models/index')

const deleteCommentMiddleware = async (request, response, next) => {
  const { authorization } = request.headers
  if (!authorization) {
    return response.status(401).send('Authorization token required')
  }

  const token = authorization.split(' ')[1]
  const { id } = await jwt.verify(token, process.env.SECRET)
  const commentId = request.params.id
  const comment = await Comment.findOne({ where: { id: commentId } })
  if (comment || comment.userId !== id) {
    return response.status(401).send('user is not authorized')
  }

  next()
}

module.exports = deleteCommentMiddleware

const jwt = require('jsonwebtoken')
const { Post } = require('../models/models')

const deletePostMiddleware = async (request, response, next) => {
  const { authorization } = request.headers
  if (!authorization) {
    return response.status(401).send('Authorization token required')
  }

  const token = authorization.split(' ')[1]
  const { id } = await jwt.verify(token, process.env.SECRET)
  const postId = request.params.id
  const post = await Post.findOne({ where: { id: postId } })
  console.log(post.userId, '---', id)
  if (post.userId !== id) {
    return response.status(401).send('user is not authorized')
  }

  next()
}

module.exports = deletePostMiddleware

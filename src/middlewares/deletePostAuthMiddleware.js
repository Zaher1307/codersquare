const { Post } = require('../models/index')
const responseSender = require('../utils/responseSender')

const deletePostMiddleware = async (request, response, next) => {
  const postId = request.params.id
  const post = await Post.findOne({
    where: { id: postId, userId: response.locals.userId }
  })
  if (!post) {
    return responseSender(response, 401, 'user is not authorized')
  }

  next()
}

module.exports = deletePostMiddleware

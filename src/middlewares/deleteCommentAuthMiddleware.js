const { Comment } = require('../models/index')
const responseSender = require('../utils/responseSender')

const deleteCommentMiddleware = async (request, response, next) => {
  const commentId = request.params.id
  const comment = await Comment.findOne({
    where: { id: commentId, userId: response.locals.userId }
  })
  if (!comment) {
    return responseSender(response, 401, 'user is not authorized')
  }

  next()
}

module.exports = deleteCommentMiddleware

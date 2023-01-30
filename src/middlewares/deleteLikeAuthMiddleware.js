const { Like } = require('../models/index')
const responseSender = require('../utils/responseSender')

const deleteLikeMiddleware = async (request, response, next) => {
  const postId = request.params.id
  const like = await Like.findOne({
    where: { postId, userId: response.locals.userId }
  })
  if (!like) {
    return responseSender(response, 401, 'user is not authorized')
  }

  next()
}

module.exports = deleteLikeMiddleware

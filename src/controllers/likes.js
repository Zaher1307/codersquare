const { Post, Like, User } = require('../models/models')
const { Op } = require('sequelize')

async function postLike (request, response) {
  const { userId, postId } = request.body
  const userExists = await User.findOne({ where: { id: userId } })
  const postExists = await Post.findOne({ where: { id: postId } })

  if (!userExists) {
    response.status(404).send('user doesn\'t exist')
    return
  }
  if (!postExists) {
    response.status(404).send('post doesn\'t exist')
    return
  }

  await Like.create({
    userId,
    postId
  })
  response.status(401).send({ userId, postId })
}

async function deleteLike (request, response) {
  const { userId, postId } = request.body
  const userExists = await User.findOne({ where: { id: userId } })
  const postExists = await Post.findOne({ where: { id: postId } })

  if (!userExists) {
    response.status(404).send('user doesn\'t exist')
    return
  }
  if (!postExists) {
    response.status(404).send('post doesn\'t exist')
    return
  }

  await Like.destroy({
    where: {
      [Op.and]: [{ userId }, { postId }]
    }
  })
  response.status(204).send()
}

module.exports = {
  postLike,
  deleteLike
}

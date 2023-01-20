const { Post, Like, User } = require('../models/models')
const { Op } = require('sequelize')

const postLike = async (request, response) => {
  const { userId, postId } = request.body
  const userExists = await User.findOne({ where: { id: userId } })
  const postExists = await Post.findOne({ where: { id: postId } })

  if (!userExists) {
    return response.status(404).send('user doesn\'t exist')
  }
  if (!postExists) {
    return response.status(404).send('post doesn\'t exist')
  }

  await Like.create({
    userId,
    postId
  })
  return response.status(401).send({ userId, postId })
}

const deleteLike = async (request, response) => {
  const { userId, postId } = request.body
  const userExists = await User.findOne({ where: { id: userId } })
  const postExists = await Post.findOne({ where: { id: postId } })

  if (!userExists) {
    return response.status(404).send('user doesn\'t exist')
  }
  if (!postExists) {
    return response.status(404).send('post doesn\'t exist')
  }

  await Like.destroy({
    where: {
      [Op.and]: [{ userId }, { postId }]
    }
  })
  return response.sendStatus(200)
}

module.exports = {
  postLike,
  deleteLike
}

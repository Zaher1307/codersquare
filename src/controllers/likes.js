const { User } = require('../models/index')
const { Post } = require('../models/index')
const { Like } = require('../models/index')
const responseSender = require('../utils/responseSender')
const { Op } = require('sequelize')

const getLikes = async (request, response) => {
  const postId = request.params.id
  const postExists = await Post.findOne({ where: { id: postId } })

  if (!postExists) {
    return responseSender(response, 404, 'post doesn\'t exist')
  }

  const likes = await Like.findAll({ where: { postId } })
  return response.status(200).send(likes)
}

const postLike = async (request, response) => {
  const { postId } = request.body
  const { userId } = response.locals
  const userExists = await User.findOne({ where: { id: userId } })
  const postExists = await Post.findOne({ where: { id: postId } })
  const likeExists = await Like.findOne({
    where: {
      [Op.and]: [
        { userId }, { postId }
      ]
    }
  })

  if (!userExists) {
    return responseSender(response, 404, 'user doesn\'t exist')
  }
  if (!postExists) {
    return responseSender(response, 404, 'post doesn\'t exist')
  }
  if (likeExists) {
    return responseSender(response, 409, 'like already exists')
  }

  try {
    await Like.create({
      userId,
      postId
    })
    return response.status(200).send({ userId, postId })
  } catch (err) {
    return response.sendStatus(500)
  }
}

const deleteLike = async (request, response) => {
  const postId = request.params.id
  const { userId } = response.locals
  const postExists = await Post.findOne({ where: { id: postId } })

  if (!postExists) {
    return responseSender(response, 404, 'post doesn\'t exist')
  }

  try {
    await Like.destroy({
      where: {
        [Op.and]: [{ userId }, { postId }]
      }
    })
    return response.sendStatus(200)
  } catch (err) {
    response.sendStatus(500)
  }
}

module.exports = {
  getLikes,
  postLike,
  deleteLike
}

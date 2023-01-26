const { Post, Comment, User } = require('../models/models')
const { responseSender } = require('../utils/responseSender')
const crypto = require('crypto')

const postComment = async (request, response) => {
  const { userId, postId, comment } = request.body
  const userExists = await User.findOne({ where: { id: userId } })
  const postExists = await Post.findOne({ where: { id: postId } })

  if (!userExists) {
    return responseSender(response, 404, 'user doesn\'t exist')
  }
  if (!postExists) {
    return responseSender(response, 404, 'post doesn\'t exist')
  }

  const newCommentId = crypto.randomUUID()

  try {
    const createdComment = await Comment.create({
      id: newCommentId,
      userId,
      postId,
      comment
    })
    return response.status(201).send(createdComment)
  } catch (err) {
    response.sendStatus(500)
  }
}

const getComments = async (request, response) => {
  const postId = request.params.id
  const postExists = await Post.findOne({ where: { id: postId } })

  if (!postExists) {
    return responseSender(response, 404, 'post doesn\'t exist')
  }

  const comments = Comment.findAll({
    where: {
      postId
    }
  })
  return response.status(200).send(comments)
}

const deleteComment = async (request, response) => {
  const commentId = request.params.id
  const commentExists = await Comment.findOne({ where: { id: commentId } })

  if (!commentExists) {
    return responseSender(response, 404, 'comment doesn\'t exist')
  }

  try {
    await Comment.destroy({
      where: {
        id: commentId
      }
    })
    return response.sendStatus(200)
  } catch (err) {
    response.sendStatus(500)
  }
}

module.exports = {
  postComment,
  getComments,
  deleteComment
}

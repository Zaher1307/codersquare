const { Post, Comment, User } = require('../models/models')
const crypto = require('crypto')

const postComment = async (request, response) => {
  const { userId, postId, comment } = request.body
  const userExists = await User.findOne({ where: { id: userId } })
  const postExists = await Post.findOne({ where: { id: postId } })

  if (!userExists) {
    return response.status(404).send('user doesn\'t exist')
  }
  if (!postExists) {
    return response.status(404).send('post doesn\'t exist')
  }

  const newCommentId = crypto.randomUUID()
  await Comment.create({
    id: newCommentId,
    userId,
    postId,
    comment
  })
  const createdComment = await Comment.findOne({ where: { id: newCommentId } })
  return response.status(201).send(createdComment)
}

const getComments = async (request, response) => {
  const postId = request.params.id
  const postExists = await Post.findOne({ where: { id: postId } })

  if (!postExists) {
    return response.status(404).send('post doesn\'t exist')
  }

  const comments = Comment.findAll({
    where: {
      postId
    }
  })
  response.status(200).send(comments)
}

const deleteComment = async (request, response) => {
  const commentId = request.params.id
  const commentExists = await Comment.findOne({ where: { id: commentId } })

  if (!commentExists) {
    return response.status(404).send('comment doesn\'t exist')
  }

  await Comment.destroy({
    where: {
      id: commentId
    }
  })
  return response.sendStatus(200)
}

module.exports = {
  postComment,
  getComments,
  deleteComment
}

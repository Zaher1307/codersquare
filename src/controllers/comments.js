const { Post, Comment, User } = require('../models/models')
const crypto = require('crypto')

async function postComment (request, response) {
  const { userId, postId, comment } = request.body
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

  const newCommentId = crypto.randomUUID()
  await Comment.create({
    id: newCommentId,
    userId,
    postId,
    comment
  })
  console.log('database dropped !!!!!!!')
  const createdComment = await Comment.findOne({ where: { id: newCommentId } })
  response.status(201).send(createdComment)
}

async function getComments (request, response) {
  const postId = request.params.id
  const postExists = await Post.findOne({ where: { id: postId } })

  if (!postExists) {
    response.status(404).send('post doesn\'t exist')
    return
  }

  const comments = Comment.findAll({
    where: {
      postId
    }
  })
  response.status(200).send(comments)
}

async function deleteComment (request, response) {
  const commentId = request.params.id
  const commentExists = await Post.findOne({ where: { id: commentId } })

  if (!commentExists) {
    response.status(404).send('post doesn\'t exist')
    return
  }

  await Comment.destroy({
    where: {
      id: commentId
    }
  })
}

module.exports = {
  postComment,
  getComments,
  deleteComment
}

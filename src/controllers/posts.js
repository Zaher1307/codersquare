const { Post, User } = require('../models/models')
const crypto = require('crypto')

async function getAllPosts (request, response) {
  const posts = await Post.findAll()
  response.contentType = 'application/json'
  response.status(200).send(posts)
}

async function postPost (request, response) {
  const { userId, title } = request.body
  const userExists = await User.findOne({ where: { id: userId } })
  const titleExists = await Post.findOne({ where: { title } })

  if (!userExists) {
    response.status(404).send('user doesn\'t exist')
    return
  }
  if (titleExists) {
    response.status(409).send('title already exists')
    return
  }

  const newPostId = crypto.randomUUID()
  await Post.create({
    id: newPostId,
    userId,
    title
  })
  const createdPost = await Post.findOne({ where: { title } })
  response.status(201).send(createdPost)
}

async function getPost (request, response) {
  const postId = request.params.id
  const post = await Post.findOne({ where: { id: postId } })
  if (!post) {
    response.status(404).send('post not found')
    return
  }
  response.status(200).send(post)
}

async function deletePost (request, response) {
  const postId = request.params.id
  const post = await Post.findOne({ where: { id: postId } })
  if (!post) {
    response.status(404).send('post not found')
    return
  }
  await Post.destroy({
    where: {
      id: postId
    }
  })
  response.status(204).send()
}

module.exports = {
  getAllPosts,
  postPost,
  getPost,
  deletePost
}

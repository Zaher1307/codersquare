const { Post, User } = require('../models/models')
const crypto = require('crypto')

const getAllPosts = async (request, response) => {
  const posts = await Post.findAll()
  response.contentType = 'application/json'
  response.status(200).send(posts)
}

const postPost = async (request, response) => {
  const { userId, title } = request.body
  if (!userId || !title) {
    return response.status(400).send('bad request: all fields are requried')
  }

  const userExists = await User.findOne({ where: { id: userId } })
  const titleExists = await Post.findOne({ where: { title } })

  if (!userExists) {
    return response.status(404).send('user doesn\'t exist')
  }
  if (titleExists) {
    return response.status(409).send('title already exists')
  }

  const newPostId = crypto.randomUUID()

  try {
    const createdPost = await Post.create({
      id: newPostId,
      userId,
      title
    })
    return response.status(201).send(createdPost)
  } catch (err) {
    return response.sendStatus(500)
  }
}

const getPost = async (request, response) => {
  const postId = request.params.id
  const post = await Post.findOne({ where: { id: postId } })
  if (!post) {
    return response.status(404).send('post not found')
  }
  response.status(200).send(post)
}

const deletePost = async (request, response) => {
  const postId = request.params.id
  const post = await Post.findOne({ where: { id: postId } })
  if (!post) {
    return response.status(404).send('post not found')
  }

  try {
    await Post.destroy({
      where: {
        id: postId
      }
    })
    return response.sendStatus(200)
  } catch (err) {
    return response.sendStatus(500)
  }
}

module.exports = {
  getAllPosts,
  postPost,
  getPost,
  deletePost
}

const { User } = require('../models/index')
const { Post } = require('../models/index')
const responseSender = require('../utils/responseSender')
const crypto = require('crypto')

const getAllPosts = async (request, response) => {
  const posts = await Post.findAll()
  response.status(200).send(posts)
}

const postPost = async (request, response) => {
  const { title } = request.body
  const { userId } = response.locals
  if (!userId || !title) {
    return responseSender(response, 400, 'all fields are requried')
  }

  const userExists = await User.findOne({ where: { id: userId } })
  const titleExists = await Post.findOne({ where: { title } })

  if (!userExists) {
    return responseSender(response, 404, 'user doesn\'t exist')
  }
  if (titleExists) {
    return responseSender(response, 409, 'title already exist')
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
    return responseSender(response, 404, 'post not found')
  }
  response.status(200).send(post)
}

const deletePost = async (request, response) => {
  const postId = request.params.id
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

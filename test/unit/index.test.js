const request = require('supertest')
const { User, Post, Like, Comment } = require('../../src/models/index')
const app = require('../../src/app')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: '30d' })
}

const createUser = async (email, username) => {
  const id = crypto.randomUUID()
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash('Aa123456!', salt)
  await User.create({
    id,
    name: 'Ahmed',
    username,
    email,
    password: hash
  })
  return id
}

const createPost = async (userId, title) => {
  const postId = crypto.randomUUID()
  await Post.create({
    id: postId,
    title,
    userId
  })
  return postId
}

const createComment = async (userId, postId, comment) => {
  const commentId = crypto.randomUUID()
  await Comment.create({
    id: commentId,
    userId,
    postId,
    comment
  })
  return commentId
}

const createLike = async (userId, postId) => {
  await Like.create({
    userId,
    postId
  })
}

beforeEach(async () => {
  await User.destroy({
    where: {},
    truncate: true
  })
  await Post.destroy({
    where: {},
    truncate: true
  })
  await Comment.destroy({
    where: {},
    truncate: true
  })
  await Like.destroy({
    where: {},
    truncate: true
  })
})

describe('users endpoints', () => {
  it('signup endpoint with right data', async () => {
    const requestBody = {
      name: 'Ahmed Zaher',
      username: 'zaher',
      email: 'zaher@example.com',
      password: 'Aa123456!'
    }
    const response = await request(app).post('/users/signup/').send(requestBody)
    expect(response.statusCode).toBe(201)
    expect(response.body.token).not.toBeNull()
  })

  it('login endpoint with existing user', async () => {
    await createUser('zaher@example.com', 'zaher')
    const requestBody = {
      emailOrUsername: 'zaher',
      password: 'Aa123456!'
    }
    const response = await request(app).post('/users/login/').send(requestBody)
    expect(response.statusCode).toBe(200)
    expect(response.body.token).not.toBeNull()
  })

  it('login endpoint with wrong data', async () => {
    const requestBody = {
      emailOrUsername: 'noOne',
      password: 'Aa123456!'
    }
    const response = await request(app).post('/users/login/').send(requestBody)
    expect(response.statusCode).toBe(404)
  })

  it('signup endpoint with wrong data', async () => {
    const requestBody = {
      name: 'AhmedZaher',
      username: 'zaher',
      email: 'zaherexample.com',
      password: 'Aa123456'
    }
    const response = await request(app).post('/users/signup/').send(requestBody)
    expect(response.statusCode).toBe(400)
  })
})

describe('posts endpoints', () => {
  it('get all posts endpoint with no auth', async () => {
    const response = await request(app).get('/posts/')
    expect(response.statusCode).toBe(401)
    expect(response.body.msg).toBe('Authorization token required')
  })

  it('get all posts endpoint with auth', async () => {
    const id = await createUser('zaher@example.com', 'zaher')
    const token = createToken(id)
    const response = await request(app).get('/posts/')
      .set('Authorization', 'Bearer ' + token)
    expect(response.statusCode).toBe(200)
    expect(response.body.posts).not.toBeNull()
  })

  it('create a post with auth', async () => {
    const id = await createUser('zaher@example.com', 'zaher')
    const token = createToken(id)
    const response = await request(app).post('/posts/')
      .set('Authorization', 'Bearer ' + token)
      .send({ title: 'post title' })
    expect(response.statusCode).toBe(201)
    expect(response.body.post).not.toBeNull()
  })

  it('delete a post with unauthorized user', async () => {
    const userId = await createUser('zaher@example.com', 'zaher')
    const postId = await createPost(userId, 'post title')
    const alterId = await createUser('hossam@example.com', 'hossam')
    const token = createToken(alterId)
    const response = await request(app).delete('/posts/' + postId)
      .set('Authorization', 'Bearer ' + token)
    expect(response.statusCode).toBe(401)
    expect(response.body.msg).toBe('user is not authorized')
  })

  it('delete a post with authorized user', async () => {
    const userId = await createUser('zaher@example.com', 'zaher')
    const postId = await createPost(userId, 'post title')
    const token = createToken(userId)
    const response = await request(app).delete('/posts/' + postId)
      .set('Authorization', 'Bearer ' + token)
    expect(response.statusCode).toBe(200)
  })
})

describe('comments endpoints', () => {
  it('create comment with without Authorization token', async () => {
    const userId = await createUser('zaher@example.com', 'zaher')
    const postId = await createPost(userId, 'post title')
    const response = await request(app).post('/comments/')
      .send({ postId, comment: 'post comment' })
    expect(response.statusCode).toBe(401)
    expect(response.body.msg).toBe('Authorization token required')
  })

  it('create comment with Authorization token', async () => {
    const userId = await createUser('zaher@example.com', 'zaher')
    const postId = await createPost(userId, 'post title')
    const token = createToken(userId)
    const response = await request(app).post('/comments/')
      .set('Authorization', 'Bearer ' + token)
      .send({ postId, comment: 'post comment' })
    expect(response.statusCode).toBe(201)
  })

  it('delete comment with unauthorized user', async () => {
    const userId = await createUser('zaher@example.com', 'zaher')
    const postId = await createPost(userId, 'post title')
    const commentId = await createComment(userId, postId, 'post comment')
    const alterId = await createUser('hossam@example.com', 'hossam')
    const token = createToken(alterId)
    const response = await request(app).delete('/comments/' + commentId)
      .set('Authorization', 'Bearer ' + token)
    expect(response.statusCode).toBe(401)
    expect(response.body.msg).toBe('user is not authorized')
  })

  it('delete comment with authorized user', async () => {
    const userId = await createUser('zaher@example.com', 'zaher')
    const postId = await createPost(userId, 'post title')
    const commentId = await createComment(userId, postId, 'post comment')
    const token = createToken(userId)
    const response = await request(app).delete('/comments/' + commentId)
      .set('Authorization', 'Bearer ' + token)
    expect(response.statusCode).toBe(200)
  })
})
describe('likes endpoints', () => {
  it('create like without authorization token', async () => {
    const userId = await createUser('zaher@example.com', 'zaher')
    const postId = await createPost(userId, 'post title')
    const response = await request(app).delete('/likes/')
      .send({ postId })
    expect(response.statusCode).toBe(401)
    expect(response.body.msg).toBe('Authorization token required')
  })

  it('create like with authorization token', async () => {
    const userId = await createUser('zaher@example.com', 'zaher')
    const postId = await createPost(userId, 'post title')
    const token = createToken(userId)
    const response = await request(app).post('/likes/')
      .set('Authorization', 'Bearer ' + token)
      .send({ postId })
    expect(response.statusCode).toBe(200)
  })

  it('delete like with unauthorized user', async () => {
    const userId = await createUser('zaher@example.com', 'zaher')
    const postId = await createPost(userId, 'post title')
    await createLike(userId, postId)
    const alterId = await createUser('hossam@example.com', 'hossam')
    const token = createToken(alterId)
    const response = await request(app).delete('/likes/' + postId)
      .set('Authorization', 'Bearer ' + token)
    expect(response.statusCode).toBe(401)
    expect(response.body.msg).toBe('user is not authorized')
  })

  it('delete like with authorized user', async () => {
    const userId = await createUser('zaher@example.com', 'zaher')
    const postId = await createPost(userId, 'post title')
    await createLike(userId, postId)
    const token = createToken(userId)
    const response = await request(app).delete('/likes/' + postId)
      .set('Authorization', 'Bearer ' + token)
    expect(response.statusCode).toBe(200)
  })
})

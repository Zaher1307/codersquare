const { User } = require('../models/models')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const loginUser = async (request, response) => {
  const { emailOrUsername, password } = request.body

  if (!emailOrUsername || !password) {
    return response.status(400).send('bad request: all fields are requried')
  }

  const user = await User.findOne({
    where: {
      [Op.or]: [
        { username: emailOrUsername },
        { email: emailOrUsername }
      ]
    }
  })
  if (!user) {
    return response.status(404).send('user not found')
  }
  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    return response.status(400).send('bad request: invalid password')
  }

  const token = createToken(user.id)

  return response.status(200).send({ user, token })
}

const signupUser = async (request, response) => {
  const { username, password, email, name } = request.body

  if (!username || !password || !email || !name) {
    return response.status(400).send('bad request: all fields are requried')
  }
  if (!validator.isEmail(email)) {
    return response.status(400).send('bad request: invalid email')
  }
  if (!validator.isStrongPassword(password)) {
    return response.status(400).send('bad request: weak password')
  }

  const usernameExists = await User.findOne({ where: { username } })
  const emailExists = await User.findOne({ where: { email } })

  if (usernameExists) {
    return response.status(409).send('username already exists')
  }
  if (emailExists) {
    return response.status(409).send('email already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  const newUserId = crypto.randomUUID()

  try {
    const createdUser = await User.create({
      id: newUserId,
      username,
      email,
      name,
      password: hash
    })

    const token = createToken(newUserId)
    return response.status(201).send({ createdUser, token })
  } catch (err) {
    return response.sendStatus(500)
  }
}

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: '30d' })
}

module.exports = {
  loginUser,
  signupUser
}

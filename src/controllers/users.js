const { User } = require('../models/index')
const { Op } = require('sequelize')
const responseSender = require('../utils/responseSender')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const loginUser = async (request, response) => {
  const { emailOrUsername, password } = request.body

  if (!emailOrUsername || !password) {
    return responseSender(response, 400, 'all fields are requried')
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
    return responseSender(response, 404, 'user not found')
  }
  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    return responseSender(response, 400, 'invalid password')
  }

  const token = createToken(user.id)

  return response.status(200).send({ user, token })
}

const signupUser = async (request, response) => {
  const { username, password, email, name } = request.body

  if (!username || !password || !email || !name) {
    return responseSender(response, 400, 'all fields are required')
  }
  if (!validator.isEmail(email)) {
    return responseSender(response, 400, 'invalid email')
  }
  if (!validator.isStrongPassword(password)) {
    return responseSender(response, 400, 'weak password')
  }

  const usernameExists = await User.findOne({ where: { username } })
  const emailExists = await User.findOne({ where: { email } })

  if (usernameExists) {
    return responseSender(response, 400, 'username already exists')
  }
  if (emailExists) {
    return responseSender(response, 409, 'email already exists')
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

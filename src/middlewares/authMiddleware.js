const jwt = require('jsonwebtoken')
const { User } = require('../models/index')
const responseSender = require('../utils/responseSender')

const authMiddleware = async (request, response, next) => {
  const { authorization } = request.headers
  if (!authorization) {
    return responseSender(response, 401, 'Authorization token required')
  }

  const token = authorization.split(' ')[1]
  try {
    const { id } = await jwt.verify(token, process.env.SECRET)
    const user = await User.findOne({ where: { id } })
    if (!user) {
      return responseSender(response, 401, 'user not authorized')
    }
  } catch (err) {
    return responseSender(response, 401, 'invalid token')
  }

  next()
}

module.exports = authMiddleware

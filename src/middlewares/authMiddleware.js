const jwt = require('jsonwebtoken')
const { User } = require('../models/index')

const authMiddleware = async (request, response, next) => {
  const { authorization } = request.headers
  if (!authorization) {
    return response.status(401).send('Authorization token required')
  }

  const token = authorization.split(' ')[1]
  const { id } = await jwt.verify(token, process.env.SECRET)
  const user = await User.findOne({ where: { id } })
  if (!user) {
    return response.status(401).send('user not authorized')
  }

  next()
}

module.exports = authMiddleware

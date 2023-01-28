const jwt = require('jsonwebtoken')
const responseSender = require('../utils/responseSender')

const createMiddleware = async (request, response, next) => {
  const { authorization } = request.headers
  if (!authorization) {
    return responseSender(response, 401, 'Authorization token required')
  }

  const token = authorization.split(' ')[1]
  const { id } = await jwt.verify(token, process.env.SECRET)
  request.body.userId = id
  next()
}

module.exports = createMiddleware

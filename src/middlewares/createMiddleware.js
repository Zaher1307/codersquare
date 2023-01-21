const jwt = require('jsonwebtoken')

const createMiddleware = async (request, response, next) => {
  const { authorization } = request.headers
  if (!authorization) {
    return response.status(401).send('Authorization token required')
  }

  const token = authorization.split(' ')[1]
  const { id } = await jwt.verify(token, process.env.SECRET)
  request.body.userId = id
  next()
}

module.exports = createMiddleware

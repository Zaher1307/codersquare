const responseSender = (response, statusCode, msg) => {
  return response.status(statusCode).json({ msg })
}

module.exports = responseSender

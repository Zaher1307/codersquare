const responseSender = require('../utils/responseSender')

const errMidlleware = (err, request, response, next) => {
  console.log(err)
  return responseSender(response, 500, 'Oops, an unexpected error occurred, please try again')
}

module.exports = errMidlleware

const errMidlleware = (err, request, response, next) => {
  console.log(err)
  return response.status(500).send('Oops, an unexpected error occurred, please try again')
}

module.exports = errMidlleware

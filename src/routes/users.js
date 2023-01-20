const express = require('express')
const controllers = require('../controllers/users')
const router = express.Router()

router.post('/login', controllers.loginUser)
router.post('/signup', controllers.signupUser)

module.exports = router

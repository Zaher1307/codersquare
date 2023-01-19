const express = require('express')
const controllers = require('../controllers/likes')
const router = express.Router()

router.post('/', controllers.postLike)
router.delete('/', controllers.deleteLike)

module.exports = router

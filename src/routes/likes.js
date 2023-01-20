const express = require('express')
const controllers = require('../controllers/likes')
const deleteLikeMiddleware = require('../middlewares/deleteLikeAuthMiddleware')
const router = express.Router()

router.post('/', controllers.postLike)
router.delete('/', deleteLikeMiddleware, controllers.deleteLike)

module.exports = router

const express = require('express')
const controllers = require('../controllers/likes')
const createMiddleware = require('../middlewares/createMiddleware')
const deleteLikeMiddleware = require('../middlewares/deleteLikeAuthMiddleware')
const router = express.Router()

router.get('/:id', controllers.getLikes)
router.post('/', createMiddleware, controllers.postLike)
router.delete('/', deleteLikeMiddleware, controllers.deleteLike)

module.exports = router

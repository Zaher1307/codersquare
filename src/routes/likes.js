const express = require('express')
const controllers = require('../controllers/likes')
const deleteLikeMiddleware = require('../middlewares/deleteLikeAuthMiddleware')
const router = express.Router()

router.get('/:id', controllers.getLikes)
router.post('/', controllers.postLike)
router.delete('/:id', deleteLikeMiddleware, controllers.deleteLike)

module.exports = router

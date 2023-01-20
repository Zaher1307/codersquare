const express = require('express')
const controllers = require('../controllers/comments')
const deleteCommentMiddleware = require('../middlewares/deleteCommentAuthMiddleware')
const router = express.Router()

router.get('/:id', controllers.getComments)
router.post('/', controllers.postComment)
router.delete('/:id', deleteCommentMiddleware, controllers.deleteComment)

module.exports = router

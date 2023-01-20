const express = require('express')
const controllers = require('../controllers/posts')
const deletePostMiddleware = require('../middlewares/deletePostAuthMiddleware')
const router = express.Router()

router.get('/', controllers.getAllPosts)
router.post('/', controllers.postPost)
router.get('/:id', controllers.getPost)
router.delete('/:id', deletePostMiddleware, controllers.deletePost)

module.exports = router

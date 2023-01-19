const express = require('express')
const controllers = require('../controllers/posts')
const router = express.Router()

router.get('/', controllers.getAllPosts)
router.post('/', controllers.postPost)
router.get('/:id', controllers.getPost)
router.delete('/:id', controllers.deletePost)

module.exports = router

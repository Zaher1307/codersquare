const express = require('express')
const controllers = require('../controllers/comments')
const router = express.Router()

router.get('/:id', controllers.getComments)
router.post('/', controllers.postComment)
router.delete('/:id', controllers.deleteComment)

module.exports = router

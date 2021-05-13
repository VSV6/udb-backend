const express = require('express')

const { createPost, deletePost, getPost, getPosts, updatePost } = require('../controllers/post')
const { authenticateAccess } = require('../middlewares/auth')

const router = express.Router()

router.post('/:id', authenticateAccess, createPost)
router.delete('/:id/:pid', authenticateAccess, deletePost)
router.get('/getOne/:pid', getPost)
router.get('/:id', authenticateAccess, getPosts)
router.put('/:pid', updatePost)

module.exports = router
const express = require('express')

const { createPost, deletePost, getPost, getPosts, updatePost } = require('../controllers/post')

const router = express.Router()

router.post('/:id', createPost)
router.delete('/:id/:pid', deletePost)
router.get('/getOne/:pid', getPost)
router.get('/:id', getPosts)
router.put('/:pid', updatePost)

module.exports = router
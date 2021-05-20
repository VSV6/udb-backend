const express = require('express')
const upload = require('../utils/multer')

const { authenticateAccess } = require('../middlewares/auth')
const { createPost, deletePost, getPost, getPosts, updatePost } = require('../controllers/post')

const router = express.Router()

router.post('/:id', authenticateAccess, upload.single('photo'), createPost)
router.delete('/:id/:pid', authenticateAccess, deletePost)
router.get('/getOne/:pid', getPost)
router.get('/:id', authenticateAccess, getPosts)
router.put('/:pid', updatePost)

module.exports = router
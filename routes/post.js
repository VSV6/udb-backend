const express = require('express')
const multer = require('multer')

const { authenticateAccess } = require('../middlewares/auth')
const { createPost, deletePost, getPost, getPosts, updatePost } = require('../controllers/post')

const router = express.Router()
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.originalname)
    }
})
const upload = multer({ storage })

router.post('/:id', upload.single('photo'), createPost)
router.delete('/:id/:pid', authenticateAccess, deletePost)
router.get('/getOne/:pid', getPost)
router.get('/:id', authenticateAccess, getPosts)
router.put('/:pid', updatePost)

module.exports = router
const express = require('express')
const multer = require('multer')

const { createUser, deleteUser, getUser, getUsers, updateUser } = require('../controllers/user')
const { authenticateAccess } = require('../middlewares/auth')

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

router.post('/', createUser)
router.delete('/:id', deleteUser)
router.get('/:id', authenticateAccess, getUser)
router.get('/', getUsers)
router.put('/:id', authenticateAccess, upload.single('photo'), updateUser)

module.exports = router
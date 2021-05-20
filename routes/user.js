const express = require('express')
const upload = require('../utils/multer')

const { createUser, deleteUser, getUser, getUsers, updateUser } = require('../controllers/user')
const { authenticateAccess } = require('../middlewares/auth')

const router = express.Router()

router.post('/', createUser)
router.delete('/:id', deleteUser)
router.get('/:id', authenticateAccess, getUser)
router.get('/', getUsers)
router.put('/:id', authenticateAccess, upload.single('photo'), updateUser)

module.exports = router
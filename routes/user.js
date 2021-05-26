const express = require('express')
const upload = require('../utils/multer')

const { createUser, deleteUser, getUser, getUsers, updateUser, updateUserPassword, updateUserProfileImage } = require('../controllers/user')
const { authenticateAccess } = require('../middlewares/auth')

const router = express.Router()

router.post('/', createUser)
router.delete('/:id', deleteUser)
router.get('/:id', authenticateAccess, getUser)
router.get('/', getUsers)
router.put('/:id', authenticateAccess, updateUser)
router.put('/:id/changePassword', authenticateAccess, updateUserPassword)
router.put('/:id/changeProfileImage', authenticateAccess, upload.single('photo'), updateUserProfileImage)

module.exports = router
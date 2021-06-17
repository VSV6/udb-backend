const express = require('express')
const upload = require('../utils/multer')

const { authenticateAccess, authenticateUser } = require('../middlewares/auth')
const { createUser, deleteUser, getUser, getUsers, updateUser, updateUserPassword, updateUserProfileImage } = require('../controllers/user')

const router = express.Router()

router.post('/', createUser)
router.delete('/:id', deleteUser)
router.get('/:id', authenticateAccess, getUser)
router.get('/', getUsers)
router.put('/:id', authenticateAccess, authenticateUser, updateUser)
router.put('/:id/changePassword', authenticateAccess, authenticateUser, updateUserPassword)
router.put('/:id/changeProfileImage', authenticateAccess, authenticateUser, upload.single('photo'), updateUserProfileImage)

module.exports = router
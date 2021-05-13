const express = require('express')

const { createUser, deleteUser, getUser, getUsers, updateUser } = require('../controllers/user')
const { authenticateAccess } = require('../middlewares/auth')

const router = express.Router()

router.post('/', createUser)
router.delete('/:id', deleteUser)
router.get('/:id', authenticateAccess, getUser)
router.get('/', getUsers)
router.put('/:id', authenticateAccess, updateUser)

module.exports = router
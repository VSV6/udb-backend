const express = require('express')

const { authenticateUser } = require('../middlewares/auth')
const { createUser, deleteUser, getUser, getUsers, updateUser } = require('../controllers/user')

const router = express.Router()

router.post('/', createUser)
router.delete('/:id', deleteUser)
router.get('/:id', getUser)
router.get('/', getUsers)
router.put('/:id', updateUser)

module.exports = router
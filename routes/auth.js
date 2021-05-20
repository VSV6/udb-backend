const express = require('express')

const { loginUser, phoneLogin } = require('../controllers/auth')

const router = express.Router()

router.post('/login', loginUser)
router.post('/phoneLogin', phoneLogin)

module.exports = router
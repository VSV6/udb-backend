const express = require('express')

const { addComment, deleteComment, getComment, updateComment } = require('../controllers/comment')
const { authenticateAccess, authenticateUser } = require('../middlewares/auth')

const router = express.Router()

router.post('/:id/:pid', authenticateAccess, addComment)
router.delete('/:pid/:cid', authenticateAccess, authenticateUser, deleteComment)
router.get('/:cid', getComment)
router.put('/:cid', updateComment)

module.exports = router
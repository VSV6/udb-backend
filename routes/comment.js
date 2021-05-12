const express = require('express')

const { addComment, deleteComment, getComment, updateComment } = require('../controllers/comment')

const router = express.Router()

router.post('/:id/:pid', addComment)
router.delete('/:pid/:cid', deleteComment)
router.get('/:cid', getComment)
router.put('/:cid', updateComment)

module.exports = router
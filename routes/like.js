const express = require('express')

const { addLike, deleteLike, getLike } = require('../controllers/like')

const router = express.Router()

router.delete('/:pid/:lid', deleteLike)
router.get('/:id/:pid', addLike)
router.get('/:lid', getLike)

module.exports = router
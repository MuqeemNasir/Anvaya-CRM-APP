const express = require('express')
const router = express.Router()

const { addComment, getAllComments } = require('../controller/comment.controller.js') 

const { commentValidationRules } = require('../validators/comment.validator.js')
const validate = require('../middlewares/validate.js')

router.post('/:id/comments', commentValidationRules, validate, addComment)
router.get('/:id/comments', getAllComments)

module.exports = router
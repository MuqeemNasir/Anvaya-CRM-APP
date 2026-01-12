const { body } = require('express-validator')

const commentValidationRules = [
    body('commentText').notEmpty().withMessage('Comment text is required').isString().withMessage('Comment text must be a string').trim()
]

module.exports = { commentValidationRules }
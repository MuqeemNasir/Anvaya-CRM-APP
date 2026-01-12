const { body } = require('express-validator')

const agentValidationRules = [
    body('name').notEmpty().withMessage('Sales Agent name is required').isString().withMessage('Name must be a string').trim(),
    body('email').isEmail().withMessage('Invalid input: "email" must be a valid email address').normalizeEmail()
]

module.exports = { agentValidationRules }
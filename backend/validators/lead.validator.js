const { body } = require('express-validator')

const leadValidationRules = [
    body('name').notEmpty().withMessage('Lead name is required').isString(),
    body('source').isIn(['Website', 'Referral', 'Cold Call', 'Advertisement', 'Email', 'Other']).withMessage('Invalid lead source'),
    body('salesAgent').isMongoId().withMessage('Invalid Sales Agent ID format'),
    body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed']).withMessage('Invalid lead status'),
    body('timeToClose').isInt({min: 1}).withMessage('Time to Close must be a positive integer'),
    body('priority').optional().isIn(['High', 'Medium', 'Low']).withMessage('Invalid priority level'),    
]

module.exports = { leadValidationRules }
const express = require('express')
const router = express.Router()

const { createLead, getLeads, updateLead, deleteLead } = require('../controller/lead.controller')

const { leadValidationRules } = require('../validators/lead.validator')
const validate = require('../middlewares/validate')

router.post('/', leadValidationRules, validate, createLead)

router.get('/', getLeads)
router.put('/:id', updateLead)
router.delete('/:id', deleteLead)

module.exports = router

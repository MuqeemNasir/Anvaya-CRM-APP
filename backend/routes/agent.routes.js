const express = require('express')
const router = express.Router()

const {createAgent, getAgents, deleteAgent} = require('../controller/agent.controller')

const { agentValidationRules } = require('../validators/agent.validator')
const validate = require('../middlewares/validate')

router.post('/', agentValidationRules, validate, createAgent)
router.get('/', getAgents)
router.delete('/:id', deleteAgent)

module.exports = router
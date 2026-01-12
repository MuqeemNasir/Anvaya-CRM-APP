const express = require('express')
const router = express.Router()

const { getLeadsClosedLastWeek, getPipelineCount } = require('../controller/report.controller')

router.get('/last-week', getLeadsClosedLastWeek)
router.get('/pipeline', getPipelineCount)

module.exports = router
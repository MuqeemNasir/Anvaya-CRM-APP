const Lead = require('../models/Lead.model')

const getLeadsClosedLastWeek = async(req, res) => {
    try{
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const closedLeads = await Lead.find({
            status: 'Closed',
            closedAt: {$gte: sevenDaysAgo}
        }).populate('salesAgent', 'name').sort({closedAt: -1 })

        const response = closedLeads.map(lead => ({
            id: lead._id,
            name: lead.name,
            salesAgent: lead.salesAgent ? lead.salesAgent.name : "Unassigned",
            closedAt: lead.closedAt
        }))

        res.status(200).json(response)
    }catch(error){
        console.error("getLeadsClosedLastWeek error: ", error)
        res.status(500).json({message: "Server error in fetching reports."})
    }
}

const getPipelineCount = async(req, res) => {
    try{
        const pipelineCount = await Lead.countDocuments({
            status: {$ne: 'Closed'}
        })
        res.status(200).json({
            totalLeadsInPipeline: pipelineCount
        })

    }catch(error){
        console.error("getPipelineCount error: ", error)
        res.status(500).json({message: "Server error in fetching total leads in pipeline."})
    }
}

module.exports = { getLeadsClosedLastWeek, getPipelineCount }
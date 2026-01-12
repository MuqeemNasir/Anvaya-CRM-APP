const mongoose = require('mongoose')
const Lead = require('../models/Lead.model')
const SalesAgent = require('../models/SalesAgent.model')

const createLead = async (req, res) => {
    try {
        const { name, source, salesAgent, status, timeToClose, priority, tags } = req.body

        const agentExists = await SalesAgent.findById(salesAgent)
        if (!agentExists) {
            return res.status(404).json({ error: `Sales agent with ID ${salesAgent} not found.` })
        }

        const newLeadData = { name, source, salesAgent, status, timeToClose, priority, tags }
        if(status === 'Closed'){
            newLeadData.closedAt = new Date()
        }

        const newLead = new Lead({ name, source, salesAgent, status, timeToClose, priority, tags })
        const savedLead = await newLead.save()

        const responseLead = await savedLead.populate('salesAgent', 'name')
        res.status(201).json(responseLead)
    } catch (error) {
        console.error("createLead error: ", error)
        res.status(500).json({ message: "Server error in creating Lead." })
    }
}

const getLeads = async (req, res) => {
    try {
        const { salesAgent, status, tags, source } = req.query
        const filter = {}

        if (salesAgent && mongoose.Types.ObjectId.isValid(salesAgent)) {
            filter.salesAgent = salesAgent
        }

        if (status) filter.status = status
        if (source) filter.source = source
        if (tags) {
            filter.tags = { $in: Array.isArray(tags) ? tags : [tags] }
        }

        const leads = await Lead.find(filter).populate('salesAgent', 'name').sort({ createdAt: -1 })
        res.status(200).json(leads)
    } catch (error) {
        console.error("getLeads error: ", error)
        res.status(500).json({ message: "Server error in fetching all leads." })
    }
}

const updateLead = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid Lead ID format." })
        }

        const updateData = req.body
        if (updateData.salesAgent) {
            if (!mongoose.Types.ObjectId.isValid(updateData.salesAgent)) {
                return res.status(400).json({ error: "Invalid Sales Agent ID format." })
            }
            
            const agentExists = await SalesAgent.findById(updateData.salesAgent)
            if (!agentExists) {
                return res.status(400).json({ error: `Sales agent with ID '${updateData.salesAgent}' not found.` })
            }
        }

        const existingLead = await Lead.findById(id)
        if(!existingLead){
            return res.status(404).json({error: "Lead not found."})
        }

        if(updateData.status === 'Closed' && existingLead.status !== 'Closed'){
            updateData.closedAt = new Date()
        }else if(updateData.status && updateData.status !== 'Closed'){
            updateData.closedAt = null
        }

        const updatedLead = await Lead.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        }).populate('salesAgent', 'name')

        if (!updatedLead) {
            return res.status(404).json({ error: `Lead with ID '${id}' not found.` })
        }

        res.status(200).json(updatedLead)
    } catch (error) {
        console.error("updateLead error: ", error)
        res.status(500).json({ message: "Server error in updating the lead." })
    }
}


const deleteLead = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: `Invalid Lead ID format.` })
        }
        const deletedLead = await Lead.findByIdAndDelete(id)
        if (!deletedLead) {
            return res.status(404).json({ error: `Lead with ID '${id}' not found.` })
        }
        res.status(200).json({ message: "Lead deleted successfully" })
    } catch (error) {
        console.error("deleteLead error: ", error)
        res.status(500).json({ message: "Server error in deleting the lead." })
    }
}

module.exports = { createLead, getLeads, updateLead, deleteLead }
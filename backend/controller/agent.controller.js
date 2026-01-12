const Agent = require('../models/SalesAgent.model')

const createAgent = async (req, res) => {
    try {
        const { name, email } = req.body

        const newAgent = new Agent({ name, email })
        const saved = await newAgent.save()
        res.status(201).json({ message: "New Agent created successfully", data: { Agent: saved } })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: `Sales agent with email '${req.body.email}' already exists.` })
        }
        console.error("createAgent error: ", error)
        res.status(500).json({ message: "Server error in creating agent." })
    }
}

const getAgents = async (req, res) => {
    try {
        const agents = await Agent.find()
        res.status(200).json(agents)
    } catch (error) {
        console.error("getAgents error: ", error)
        res.status(500).json({ message: "Server error in fetching all agents." })
    }
}

const deleteAgent = async (req, res) => {
    try{
        const { id } = req.params
        const deleted = await Agent.findByIdAndDelete(id)
        if(!deleted){
            return res.status(404).json({error: "Agent not found."})
        }
        res.status(200).json({message: "Agent deleted successfully"})
    }catch(error){
        console.error("deleteAgent error:", error)
        res.status(500).json({message: "Server error deleting agent"})
    }
}

module.exports = { createAgent, getAgents, deleteAgent }
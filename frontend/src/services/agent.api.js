import API from "./api";

export const getAgents = async() => {
    try{
        const res = await API.get('/agents')
        return res.data
    }catch(error){
        console.error("getAgents error: ", error)
        throw error.response?.data || error.message
    }
}

export const createAgent = async(agentData) => {
    try{
        const res = await API.post('/agents', agentData)
        return res.data
    }catch(error){
        console.error("createAgent error: ", error)
        throw error.response?.data || error.message
    }
}

export const deleteAgent = async(id) => {
    const res = await API.delete(`/agents/${id}`)
    return res.data
}
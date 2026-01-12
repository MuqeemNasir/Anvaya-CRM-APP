import API from "./api";

export const getLeads = async (filters = {}) => {
    try {
        const res = await API.get(`/leads`, { params: filters })
        return res.data
    } catch (error) {
        console.error("getLeads error: ", error)
        throw error.response?.data || error.message
    }
}

export const getLeadById = async(id) => {
    try{
        const res = await API.get(`/leads`)
        return res.data.find(lead => lead._id === id)
    }catch(error){
        console.error("getLeadById error: ", error)
        throw error.response?.data || error.message
    }
}

export const createLead = async (leadData) => {
    try {
        const res = await API.post('/leads', leadData)
        return res.data
    } catch (error) {
        console.error("createLead error: ", error)
        throw error.response?.data || error.message
    }
}

export const updateLead = async (id, updateData) => {
    try {
        const res = await API.put(`/leads/${id}`, updateData)
        return res.data
    } catch (error) {
        console.error("updateLead error: ", error)
        throw error.response?.data || error.message
    }
}


export const deleteLead = async (id) => {
    try{
        const res = await API.delete(`/leads/${id}`)
        return res.data
    }catch(error){
        console.error("deleteLead error: ", error)
        throw error.response?.data || error.message
    }
}



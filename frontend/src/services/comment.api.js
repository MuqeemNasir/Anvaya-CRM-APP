import API from "./api";

export const getCommentByLead = async (leadId) => {
    try {
        const res = await API.get(`/leads/${leadId}/comments`)
        return res.data
    } catch (error) {
        console.error("getCommentByLead error: ", error)
        throw error.response?.data || error.message
    }
}

export const addComment = async (leadId, commentText) => {
    try {
        const res = await API.post(`/leads/${leadId}/comments`, { commentText })
        return res.data
    }catch(error){
        console.error("addComment error: ", error)
        throw error.response?.data || error.message
    }
}
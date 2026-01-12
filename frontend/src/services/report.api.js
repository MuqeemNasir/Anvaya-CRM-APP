import API from "./api";

export const fetchLastWeekReport = async() => {
    try{
        const res = await API.get(`/report/last-week`)
        return res.data
    }catch(error){
        console.error("fetchLastWeekReport error: ", error)
        throw error.response?.data || error.message
    }
}

export const fetchPipelineReport = async() => {
    try{
        const res = await API.get(`/report/pipeline`)
        return res.data
    }catch(error){
        console.error("fetchPipelineReport error: ", error)
        throw error.response?.data || error.message
    }
}
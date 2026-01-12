import { createContext, useContext, useEffect, useState } from "react";
import { getAgents } from "../services/agent.api";

const DataContext = createContext()
export const useDataContext = () => useContext(DataContext)

export const DataProvider = ({children}) => {
    const [agents, setAgents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const refreshAgents = async () => {
        try{
            setLoading(true)
            const agentData = await getAgents()
            setAgents(agentData)
            setError(null)
        }catch(error){
            setError("Failed to load agents")
        }finally{
            setLoading(false)
        }
    }
    useEffect(() => {
        refreshAgents()
    }, [])

    return(
        <DataContext.Provider value={{ agents, loading, error, refreshAgents }}>
            {children}
        </DataContext.Provider>
    )
}
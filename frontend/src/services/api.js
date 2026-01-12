import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"

const API = axios.create({
    baseURL: API_BASE,
    headers: {"Content-Type": "application/json"}
})

export default API



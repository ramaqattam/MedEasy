import { createContext, useState } from "react"

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    
    // Fix for the process.env error
    // Use import.meta.env for Vite projects instead of process.env
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

    const value = {
        aToken,
        setAToken,
        backendUrl,
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider
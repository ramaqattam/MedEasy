import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { DoctorContext } from '../context/DoctorContext.jsx'
import { SidebarContext } from '../context/SidebarContext.jsx'
import { FaBell, FaUserCircle, FaBars } from 'react-icons/fa'

const Navbar = () => {
    const { dToken, setDToken } = useContext(DoctorContext)
    const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext)
    const navigate = useNavigate()

    const logout = () => {
        navigate('/')
        if (dToken) {
            setDToken('')
            localStorage.removeItem('dToken')
        }
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    return (
        <div className='flex justify-between items-center bg-white px-6 py-4 border-b z-20'>
            <div className='flex items-center gap-2'>
                <button 
                    className="sidebar-toggle md:hidden mr-2 p-1 text-gray-600 rounded hover:bg-gray-100"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <FaBars className="text-xl" />
                </button>
                <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="Logo" />
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 text-xs'>
                    Doctor
                </p>
            </div>
            
            <div className="flex items-center gap-4">
                
                <button 
                    onClick={logout} 
                    className='bg-primary text-white text-sm px-4 py-2 rounded-md'
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Navbar
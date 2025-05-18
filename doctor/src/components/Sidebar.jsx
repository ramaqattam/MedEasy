import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SidebarContext } from '../context/SidebarContext'
import { FaThLarge, FaUserMd, FaUsers, FaCalendarAlt, FaSignOutAlt, FaTimes } from 'react-icons/fa'

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext)
  const location = useLocation()
  
  const menuItems = [
    { name: 'Dashboard', icon: <FaThLarge />, path: '/dashboard' },
    { name: 'Appointments', icon: <FaCalendarAlt />, path: '/appointments' },
  ]
  
  // Close sidebar on mobile after clicking a link
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }
  
  return (
    <div className={`sidebar fixed md:static inset-y-0 left-0 z-10 flex flex-col w-64 bg-white border-r border-gray-200 h-full transition-transform duration-300 transform ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      <div className="py-6 flex flex-col h-full">
        <div className="px-6 mb-8 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {'Doctor Portal'}
          </h2>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item, index) => (
            <Link 
              key={index}
              to={item.path}
              className={`flex items-center px-3 py-3 text-sm rounded-md ${
                location.pathname === item.path 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={handleLinkClick}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      
      </div>
    </div>
  )
}

export default Sidebar
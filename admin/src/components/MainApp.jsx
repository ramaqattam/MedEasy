import React from 'react'
import { SidebarProvider } from '../context/SidebarContext'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

function MainApp({ children }) {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex flex-1 relative">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default MainApp
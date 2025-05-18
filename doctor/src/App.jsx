import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DoctorContext } from './context/DoctorContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import MainApp from './components/MainApp'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { dToken } = useContext(DoctorContext)
  
  if ( !dToken) {
    return <Navigate to="/" />
  }
  
  return <MainApp>{children}</MainApp>
}

const App = () => {
  return (
    <div className='min-h-screen'>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/appointments" 
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          } 
        />

      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
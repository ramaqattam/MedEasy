import React, { useState, useContext, useEffect } from 'react'
import { AdminContext } from '../context/AdminContext.jsx'
import { DoctorContext } from '../context/DoctorContext.jsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  const { aToken, setAToken, backendUrl } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)
  const navigate = useNavigate()
  
  // Redirect if already logged in
  useEffect(() => {
    if (aToken || dToken) {
      navigate('/dashboard')
    }
  }, [aToken, dToken, navigate])

  // Clear errors when switching between Admin and Doctor login
  useEffect(() => {
    setEmailError('')
    setPasswordError('')
    setGeneralError('')
    setSuccessMessage('')
  }, [state])
  
  const validateInputs = () => {
    let isValid = true
    
    // Reset errors
    setEmailError('')
    setPasswordError('')
    setGeneralError('')
    
    // Validate email
    if (!email) {
      setEmailError('Email is required')
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address')
      isValid = false
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required')
      isValid = false
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      isValid = false
    }
    
    return isValid
  }
  
  const onSubmitHandler = async (event) => {
    event.preventDefault()
    
    // Reset errors and messages
    setEmailError('')
    setPasswordError('')
    setGeneralError('')
    setSuccessMessage('')
    
    // Validate inputs
    if (!validateInputs()) {
      return
    }
    
    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          setSuccessMessage('Admin login successful')
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
          
          // Short delay to show success message before redirecting
          setTimeout(() => {
            navigate('/dashboard')
          }, 500)
        } else {
          setGeneralError(data.message || 'Login failed')
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success) {
          setSuccessMessage('Doctor login successful')
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          
          // Short delay to show success message before redirecting
          setTimeout(() => {
            navigate('/dashboard')
          }, 500)
        } else {
          setGeneralError(data.message || 'Login failed')
        }
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setGeneralError(error.response.data.message)
      } else if (error.message === 'Network Error') {
        setGeneralError('Network error. Please check your connection.')
      } else {
        setGeneralError('Something went wrong. Please try again.')
      }
    }
  }
  
  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span> Login </p>
        
        {/* Display general error message */}
        {generalError && (
          <span className='text-red-500 text-sm w-full text-center mb-1'>{generalError}</span>
        )}
        
        {/* Display success message */}
        {successMessage && (
          <span className='text-green-500 text-sm w-full text-center mb-1'>{successMessage}</span>
        )}
        
        <div className='w-full'>
          <p>Email</p>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            className={`border ${emailError ? 'border-red-500' : 'border-[#DADADA]'} rounded w-full p-2 mt-1`} 
            type="email" 
            required 
          />
          {emailError && (
            <span className='text-red-500 text-xs mt-1 block'>{emailError}</span>
          )}
        </div>
        
        <div className='w-full'>
          <p>Password</p>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            className={`border ${passwordError ? 'border-red-500' : 'border-[#DADADA]'} rounded w-full p-2 mt-1`} 
            type="password" 
            required 
          />
          {passwordError && (
            <span className='text-red-500 text-xs mt-1 block'>{passwordError}</span>
          )}
        </div>
        
        <button className='bg-primary text-white w-full py-2 rounded-md text-base mt-2'>Login</button>
        
        {
          state === 'Admin'
          ? <p className='w-full text-center'>Doctor Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Doctor')}>Click here</span></p>
          : <p className='w-full text-center'>Admin Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Admin')}>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login
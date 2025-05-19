import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create Authentication Context
const AuthContext = createContext();

// Base URL for API
const API_BASE_URL = "http://localhost:4000/api/patient"; // Adjust to your backend URL

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state from localStorage on page load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
      
      // Set authorization header for all future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    
    setLoading(false);
  }, []);

  // Configure axios default headers when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Register patient function - connects to our backend API
  const registerPatient = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      // Format date for backend
      let formattedData = { ...userData };
      if (userData.dateOfBirth) {
        formattedData.dateOfBirth = userData.dateOfBirth.toISOString();
      }
      
      // Create form data if there's an image to upload
      let data;
      if (userData.image) {
        const formData = new FormData();
        
        // Add all other fields to formData
        Object.keys(formattedData).forEach(key => {
          if (key !== 'image' && key !== 'confirmPassword' && key !== 'termsAccepted') {
            formData.append(key, formattedData[key]);
          }
        });
        
        // Add image file
        formData.append('image', userData.image);
        data = formData;
      } else {
        // If no image, just send regular JSON data without confirmPassword and terms
        const { confirmPassword, termsAccepted, ...registerData } = formattedData;
        data = registerData;
      }
      
      // Make API request
      const response = await axios.post(`${API_BASE_URL}/register`, data, {
        headers: userData.image ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      
      // Handle successful registration
      const { success, token: newToken, user, message } = response.data;
      
      if (success) {
        // Save auth data
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Update state
        setToken(newToken);
        setCurrentUser(user);
        
        // Redirect to dashboard
        navigate("/dashboard");
        return { success: true, message };
      } else {
        throw new Error(message || "Registration failed");
      }
    } catch (error) {
      // Handle registration error
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Registration failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login function - connects to our backend API
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      // Make API request
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      
      // Handle successful login
      const { success, token: newToken, user } = response.data;
      
      if (success) {
        // Save auth data
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Update state
        setToken(newToken);
        setCurrentUser(user);
        
        // Redirect based on the page the user came from, or to dashboard
        navigate("/dashboard");
        return { success: true };
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      // Handle login error
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Invalid email or password";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Clear state
    setToken(null);
    setCurrentUser(null);
    
    // Clear authorization header
    delete axios.defaults.headers.common["Authorization"];
    
    // Redirect to login page
    navigate("/login");
  };

  // Get user profile function
  const getProfile = async () => {
    try {
      setError(null);
      
      // Verify user is authenticated
      if (!token) {
        throw new Error("You must be logged in to view your profile");
      }
      
      // Make API request
      const response = await axios.get(`${API_BASE_URL}/profile`);
      
      if (response.data.success) {
        return { success: true, profile: response.data.patient };
      } else {
        throw new Error(response.data.message || "Failed to get profile");
      }
    } catch (error) {
      console.error("Get profile error:", error);
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Update user profile function
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      
      // Verify user is authenticated
      if (!token) {
        throw new Error("You must be logged in to update your profile");
      }
      
      // Create FormData if there's an image
      let data;
      let headers = {};
      
      if (profileData.image instanceof File) {
        const formData = new FormData();
        
        // Add text fields
        Object.keys(profileData).forEach(key => {
          if (key !== 'image' || profileData[key] !== null) {
            formData.append(key, profileData[key]);
          }
        });
        
        // Add image
        formData.append('image', profileData.image);
        
        data = formData;
        headers = { 'Content-Type': 'multipart/form-data' };
      } else {
        // Remove image from data if it's not a File
        const { image, ...rest } = profileData;
        data = rest;
      }
      
      // Make API request
      const response = await axios.put(`${API_BASE_URL}/profile`, data, { headers });
      
      if (response.data.success) {
        // Update current user with new profile data
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            name: response.data.patient.name,
            email: response.data.patient.email,
            image: response.data.patient.image
          };
          
          setCurrentUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        
        return { success: true, profile: response.data.patient };
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Context value with all authentication functions and state
  const value = {
    currentUser,
    token,
    loading,
    error,
    isAuthenticated: !!currentUser,
    login,
    logout,
    registerPatient,
    getProfile,
    updateProfile,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
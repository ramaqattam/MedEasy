import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create Authentication Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize user data from localStorage on page load
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    if (isLoggedIn) {
      const userType = localStorage.getItem("userType");
      const userEmail = localStorage.getItem("userEmail");
      
      setUser({
        email: userEmail,
        type: userType,
      });
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    const { email, type } = userData;
    
    // Store user info in local storage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userType", type);
    localStorage.setItem("userEmail", email);
    
    // Update state
    setUser({
      email,
      type,
    });
    
    // Redirect based on user type
    if (type === "admin") {
      navigate("/admin/dashboard");
    } else if (type === "doctor") {
      navigate("/doctor/dashboard");
    } else {
      navigate("/dashboard"); // For patients
    }
  };

  // Logout function
  const logout = () => {
    // Clear local storage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    
    // Clear state
    setUser(null);
    
    // Redirect to login
    navigate("/login");
  };

  // Register patient function
  const registerPatient = async (userData) => {
    // This would typically involve an API call to your backend
    // For now, we'll simulate a successful registration and auto-login
    
    // Simulate successful registration
    console.log("Registering patient:", userData);
    
    // Auto-login the user after registration
    login({
      email: userData.email,
      type: "patient"
    });
    
    return { success: true };
  };

  // Value object to be provided by context
  const value = {
    user,
    loading,
    login,
    logout,
    registerPatient,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import { colorTheme } from "../components/ColorTheme";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Simulate page load animation
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  // For navigation to register page (this would use react-router-dom in a real app)
  const navigateToRegister = () => {
    // In a real app with react-router-dom, this would be: navigate('/register');
    window.location.href = "/register";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // Simulate API call to backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes only - simulate different user types
      const email = formData.email.toLowerCase();
      let newUserType = null;

      if (email.includes("admin")) {
        newUserType = "admin";
      } else if (email.includes("doctor")) {
        newUserType = "doctor";
      } else {
        newUserType = "patient";
      }

      setUserType(newUserType);
      setLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Floating particles component for background
  const FloatingParticles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className={`absolute rounded-full ${
              index % 3 === 0 
                ? `bg-gradient-to-br ${colorTheme.primary.light}` 
                : index % 3 === 1 
                  ? `bg-gradient-to-br ${colorTheme.secondary.light}` 
                  : 'bg-white bg-opacity-30'
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 30 + 10}px`,
              opacity: Math.random() * 0.3 + 0.1,
              animation: `float ${Math.random() * 10 + 15}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>
    );
  };

  if (loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-emerald-100 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <FloatingParticles />
        <div className={`w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden p-8 transition-all duration-1000 transform ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className={`text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r ${colorTheme.primary.gradient} mb-4`}>
            Welcome to MedEasy!
          </h2>
          <p className="text-center text-gray-700 mb-6">
            You are successfully logged in as a{" "}
            <span className={`font-bold ${colorTheme.primary.text}`}>{userType}</span>.
          </p>
          <button
            onClick={() => setLoggedIn(false)}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r ${colorTheme.primary.gradient} hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px]`}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-emerald-100 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <FloatingParticles />
      
      <div className={`w-full max-w-md transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className={`bg-[#78C6A3] py-8 px-6 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 overflow-hidden">
              <svg className="absolute left-0 top-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 800 400">
                <path d="M 0 80 C 200 80 280 40 400 40 C 520 40 620 80 800 80 L 800 400 L 0 400 Z" className="text-white text-opacity-5" fill="currentColor"></path>
                <path d="M 0 120 C 220 120 280 80 400 80 C 520 80 620 120 800 120 L 800 400 L 0 400 Z" className="text-white text-opacity-10" fill="currentColor"></path>
              </svg>
            </div>
            
            <div className="relative">
              <div className="text-center">
                <h2 className="text-3xl font-bold">Welcome Back!</h2>
                <p className="text-white text-opacity-80 mt-2">
                  Sign in to your MedEasy account
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="py-8 px-6">
            {errorMessage && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-md animate-fadeIn">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className={`relative transition-all duration-300 ${
                focusedField === 'email' || formData.email 
                  ? 'mt-8' 
                  : 'mt-4'
              }`}>
                <label
                  htmlFor="email"
                  className={`absolute left-4 transition-all duration-300 ${
                    focusedField === 'email' || formData.email 
                      ? '-top-7 text-xs font-medium' 
                      : 'top-3 text-gray-500'
                  } ${errors.email ? 'text-red-500' : colorTheme.primary.text}`}
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 ${
                      errors.email 
                        ? 'border-red-500 bg-red-50' 
                        : focusedField === 'email' 
                          ? `border-emerald-500 bg-emerald-50` 
                          : 'border-gray-300 bg-gray-50 focus:border-emerald-500 focus:bg-emerald-50'
                    }`}
                    placeholder={focusedField === 'email' ? 'Enter your email address' : 'Email'}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-red-500 text-xs animate-slideIn">{errors.email}</p>
                )}
              </div>

              <div className={`relative transition-all duration-300 ${
                focusedField === 'password' || formData.password 
                  ? 'mt-8' 
                  : 'mt-4'
              }`}>
                <label
                  htmlFor="password"
                  className={`absolute left-4 transition-all duration-300 ${
                    focusedField === 'password' || formData.password 
                      ? '-top-7 text-xs font-medium' 
                      : 'top-3 text-gray-500'
                  } ${errors.password ? 'text-red-500' : colorTheme.primary.text}`}
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`block w-full pl-10 pr-10 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 ${
                      errors.password 
                        ? 'border-red-500 bg-red-50' 
                        : focusedField === 'password' 
                          ? `border-emerald-500 bg-emerald-50` 
                          : 'border-gray-300 bg-gray-50 focus:border-emerald-500 focus:bg-emerald-50'
                    }`}
                    placeholder={focusedField === 'password' ? 'Enter your password' : 'Password'}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-red-500 text-xs animate-slideIn">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className={`h-4 w-4 rounded border-gray-300 focus:ring-offset-0 focus:ring-2 focus:ring-emerald-500 text-emerald-500`}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  
                   <a href="#"
                    className={`font-medium ${colorTheme.primary.text} hover:text-emerald-700 transition-colors duration-200`}
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <div className="relative group">
                  <div className={`absolute -inset-0.5 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-300 ${loading ? 'bg-gray-400' : `bg-gradient-to-r ${colorTheme.primary.gradient}`}`}></div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`relative w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r ${colorTheme.primary.gradient} border border-transparent rounded-lg text-white font-medium shadow-sm hover:shadow-lg transform transition-all duration-300 hover:translate-y-[-2px] disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed disabled:shadow-none`}
                  >
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                    )}
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                </div>
              </div>
            </form>

          

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                
                <a  href="/register"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToRegister();
                  }}
                  className={`font-medium ${colorTheme.primary.text} hover:text-emerald-700 transition-colors duration-200`}
                >
                  Sign up now
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { colorTheme } from './ColorTheme';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "http://localhost:4000/api/patient"; // Adjust to your backend URL

// Function to get gradient colors based on specialty
const getSpecialtyGradient = (specialty, colorTheme) => {
  // Map specialties to specific color schemes
  const specialtyColors = {
    'Cardiology': { gradient: 'from-red-400 to-pink-500', textColor: 'text-white' },
    'Neurology': { gradient: 'from-purple-400 to-indigo-500', textColor: 'text-white' },
    'Orthopedics': { gradient: 'from-blue-400 to-cyan-500', textColor: 'text-white' },
    'Pediatrics': { gradient: 'from-teal-400 to-green-500', textColor: 'text-white' },
    'Dermatology': { gradient: 'from-amber-400 to-yellow-500', textColor: 'text-gray-800' },
    'Ophthalmology': { gradient: 'from-emerald-400 to-teal-600', textColor: 'text-white' },
    'Gynecology': { gradient: 'from-pink-400 to-rose-500', textColor: 'text-white' },
    'Dentistry': { gradient: 'from-sky-400 to-blue-600', textColor: 'text-white' },
    'Psychiatry': { gradient: 'from-indigo-400 to-violet-600', textColor: 'text-white' },
    'Oncology': { gradient: 'from-purple-500 to-indigo-700', textColor: 'text-white' },
    'default': { gradient: 'from-gray-400 to-slate-600', textColor: 'text-white' }
  };

  return specialtyColors[specialty] || specialtyColors.default;
};

// Function to get specialty icon (as a SVG element)
const getSpecialtyIcon = (specialty) => {
  // Simple SVG icons for each specialty
  const icons = {
    'Cardiology': (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'Neurology': (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    'Orthopedics': (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    'default': (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  };

  return icons[specialty] || icons.default;
};

const SpecialityMenu = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Fetch specialties from API
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/specialities`);
        
        if (response.data.success) {
          // Just store the specialties data
          setSpecialities(response.data.specialities);
        } else {
          throw new Error(response.data.message || "Failed to fetch specialties");
        }
      } catch (err) {
        console.error("Error fetching specialties:", err);
        setError("Failed to load specialties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    // For testing without API
    const mockSpecialties = [
      'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 
      'Dermatology', 'Ophthalmology', 'Gynecology', 'Dentistry', 
      'Psychiatry', 'Oncology'
    ];
    
    // Uncomment this for real API call
    // fetchSpecialties();
    
    // Mock data for development - comment this out for production
    setTimeout(() => {
      setSpecialities(mockSpecialties);
      setLoading(false);
    }, 1000);
    
  }, []);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('speciality');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);
  
  const handleClick = (speciality, index) => {
    setActiveIndex(index);
    // Navigate to ALL DOCTORS page with specialty as query parameter
    navigate('/doctors', { state: { filter: speciality } });
  };
  
  // Create a dynamic background pattern for increased visual interest
  const BackgroundPattern = () => (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-amber-200 to-yellow-100 opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-10 left-1/2 w-72 h-72 rounded-full bg-gradient-to-r from-emerald-200 to-teal-100 opacity-20 blur-3xl"></div>
      <div className="absolute top-1/3 right-10 w-48 h-48 rounded-full bg-gradient-to-r from-rose-200 to-pink-100 opacity-20 blur-3xl"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="relative flex flex-col items-center gap-4 py-16 text-gray-800 min-h-[300px]" id="speciality">
        <BackgroundPattern />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex flex-col items-center gap-4 py-16 text-gray-800" id="speciality">
        <BackgroundPattern />
        <div className="text-red-500">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className='relative flex flex-col items-center gap-4 py-16 text-gray-800' id='speciality'>
      <BackgroundPattern />
      
      <h1 
        className={`text-3xl md:text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r ${colorTheme.primary.gradient} transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        Find by speciality
      </h1>
      <p 
        className={`sm:w-1/3 text-center text-sm transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{transitionDelay: '200ms'}}
      >
        Simply browse through our extensive list of trusted doctors,
        schedule your appointment hassle-free
      </p>
      
      <div 
        className={`flex flex-wrap justify-center gap-6 md:gap-8 pt-5 w-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{transitionDelay: '400ms'}}
      >
        {specialities.map((specialty, index) => {
          const colorIndex = index % colorTheme.accent.length;
          const color = index % 3 === 0 
            ? colorTheme.primary 
            : index % 3 === 1 
              ? colorTheme.secondary 
              : colorTheme.accent[colorIndex];
              
          // Get specialty-specific styles
          const specialtyStyle = getSpecialtyGradient(specialty, colorTheme);
          const isActive = activeIndex === index;
              
          return (
            <div 
              onClick={() => handleClick(specialty, index)} 
              className={`group flex flex-col items-center text-xs cursor-pointer transition-all duration-500`} 
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              style={{
                transitionDelay: `${60 * index}ms`,
                transform: isVisible 
                  ? isActive 
                    ? 'translateY(-10px)' 
                    : 'translateY(0)' 
                  : 'translateY(20px)',
                opacity: isVisible ? 1 : 0
              }}
            >
              {/* Specialty Card - Now with text instead of image */}
              <div 
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${
                  isActive ? `bg-gradient-to-r ${specialtyStyle.gradient}` : `${color.light}`
                } p-2 mb-3 shadow-md group-hover:shadow-lg transition-all duration-300 border border-white/50 backdrop-blur-sm
                flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28`}
              >
                {/* Specialty name and icon */}
                <div className={`flex flex-col items-center justify-center z-10 transition-all duration-300 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}>
               
                  <span className={`font-medium text-center ${isActive ? specialtyStyle.textColor : 'text-gray-700'}`}>
                    {specialty}
                  </span>
                </div>
                
                {/* Animated background elements */}
                <div className={`absolute inset-0 bg-gradient-to-r ${specialtyStyle.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                {/* Visual indicators for active state */}
                {isActive && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br opacity-10"></div>
                    <div className={`absolute top-1 right-1 w-2 h-2 rounded-full bg-white animate-ping`}></div>
                    <div className={`absolute bottom-1 left-1 w-2 h-2 rounded-full bg-white animate-ping`} style={{animationDelay: '0.5s'}}></div>
                  </>
                )}
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              </div>

            </div>
          );
        })}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-10 left-1/4 w-24 h-24 rounded-full border-2 border-dashed border-emerald-200 opacity-30 rotate-45"></div>
      <div className="absolute top-20 right-1/4 w-16 h-16 rounded-full border-2 border-dashed border-amber-200 opacity-30 -rotate-12"></div>
    </div>
  );
};

export default SpecialityMenu;
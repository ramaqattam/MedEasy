import React, { useState, useEffect } from "react";
import { colorTheme } from "./ColorTheme";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/patient"; // Adjust to your backend URL

const TopDoctors = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredDoc, setHoveredDoc] = useState(null);
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  // Fetch top doctors from the API
  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/top-doctors`);
        
        if (response.data.success) {
          setTopDoctors(response.data.topDoctors);
        } else {
          throw new Error(response.data.message || "Failed to fetch top doctors");
        }
      } catch (err) {
        console.error("Error fetching top doctors:", err);
        setError("Failed to load top doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopDoctors();
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

    const element = document.getElementById('top-doctors');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const handleDoctorClick = (id) => {
    navigate(`/appointment/${id}`);
    window.scrollTo(0, 0);
  };

  const getColor = (index) => {
    const accentIndex = index % colorTheme.accent.length;
    return index % 3 === 0
      ? colorTheme.primary
      : index % 3 === 1
        ? colorTheme.secondary
        : colorTheme.accent[accentIndex];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 relative" id="top-doctors">
        <div className="w-full flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 relative" id="top-doctors">
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
    <div
      className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 relative"
      id="top-doctors"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-emerald-200 to-teal-100 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-10 left-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-amber-200 to-orange-100 opacity-20 blur-3xl"></div>
      </div>

      <h1
        className={`text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r ${colorTheme.primary.gradient} transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        Top Doctors to Book
      </h1>
      <p
        className={`sm:w-1/3 text-center text-sm transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transitionDelay: '200ms' }}
      >
        Connect with certified specialists and explore our wide range of specialties
      </p>

      <div
        className={`w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transitionDelay: '400ms' }}
      >
        {topDoctors.map((doctor, index) => { 
          const color = getColor(index);
          return (
            <div
              key={doctor._id}
              onClick={() => handleDoctorClick(doctor._id)}
              onMouseEnter={() => setHoveredDoc(index)}
              onMouseLeave={() => setHoveredDoc(null)}
              className={`border ${color.border} rounded-xl overflow-hidden cursor-pointer transition-all duration-500 bg-white shadow-md hover:shadow-xl transform ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{
                transitionDelay: `${100 * index}ms`,
                transform: hoveredDoc === index ? 'translateY(-10px)' : 'translateY(0)'
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  className={`bg-gradient-to-br ${color.light} w-full h-48 object-cover`}
                  src={doctor.Image || "/api/placeholder/150/150"}
                  alt={doctor.name}
                />

                {hoveredDoc === index && (
                  <div className={`absolute inset-0 bg-gradient-to-t ${color.gradient} opacity-30 transition-opacity duration-300`}></div>
                )}
              </div>

              <div className="p-4 relative">
                {hoveredDoc === index && (
                  <div className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${color.gradient}`}></div>
                )}

                <div className="flex items-center gap-2 text-sm text-emerald-500">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p>{doctor.available ? "Available" : "Currently Unavailable"}</p>
                </div>

                <p className="text-gray-900 text-lg font-medium mt-1">{doctor.name}</p>
                <p className={`text-sm ${color.text}`}>{doctor.speciality}</p>

                <div className={`mt-2 flex items-center justify-between transition-all duration-300 ${
                  hoveredDoc === index ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 overflow-hidden'
                }`}>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${star <= 4 ? 'text-amber-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-xs text-gray-600">{doctor.experience} years</span>
                  </div>
                </div>
              </div>

              {hoveredDoc === index && (
                <div className={`px-4 pb-3 text-xs font-medium ${color.text}`}>
                  View Profile →
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          navigate('/doctors');
          window.scrollTo(0, 0);
        }}
        className={`bg-gradient-to-r ${colorTheme.primary.gradient} text-white px-6 py-2 rounded-full mt-10 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionDelay: '800ms' }}
      >
        View All Doctors
      </button>
    </div>
  );
};

export default TopDoctors;
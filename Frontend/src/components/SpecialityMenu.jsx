// SpecialityMenu.jsx
import React, { useState, useEffect } from 'react';
import { specialityData } from '../assets/assets';
import { colorTheme } from './ColorTheme';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SpecialityMenu = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook
  
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
        {specialityData.map((item, index) => {
          const colorIndex = index % colorTheme.accent.length;
          const color = index % 3 === 0 
            ? colorTheme.primary 
            : index % 3 === 1 
              ? colorTheme.secondary 
              : colorTheme.accent[colorIndex];
              
          return (
            <div 
              onClick={() => handleClick(item.speciality, index)} 
              className={`group flex flex-col items-center text-xs cursor-pointer transition-all duration-500`} 
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              style={{
                transitionDelay: `${60 * index}ms`,
                transform: isVisible 
                  ? activeIndex === index 
                    ? 'translateY(-10px)' 
                    : 'translateY(0)' 
                  : 'translateY(20px)',
                opacity: isVisible ? 1 : 0
              }}
            >
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color.light} p-2 mb-3 shadow-md group-hover:shadow-lg transition-all duration-300 border border-white/50 backdrop-blur-sm`}>
                <div className="relative z-10">
                  <img 
                    className={`w-16 sm:w-20 transition-all duration-300 ${activeIndex === index ? 'scale-110' : 'group-hover:scale-105'}`} 
                    src={item.image} 
                    alt={item.speciality} 
                  />
                </div>
                
                {/* Animated background elements */}
                <div className={`absolute inset-0 bg-gradient-to-r ${color.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Animated dot indicators */}
                {activeIndex === index && (
                  <>
                    <div className={`absolute top-1 right-1 w-2 h-2 rounded-full bg-gradient-to-r ${color.gradient} animate-ping`}></div>
                    <div className={`absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gradient-to-r ${color.gradient} animate-ping`} style={{animationDelay: '0.5s'}}></div>
                  </>
                )}
              </div>
              
              {/* Text with animated underline */}
              <div className="relative font-medium">
                <p className={`transition-all duration-300 ${activeIndex === index ? color.text : 'text-gray-700'}`}>
                  {item.speciality}
                </p>
                <div 
                  className={`absolute -bottom-1 left-0 w-full h-0.5 transform origin-left transition-all duration-300 ${
                    activeIndex === index 
                      ? `scale-x-100 bg-gradient-to-r ${color.gradient}` 
                      : 'scale-x-0 bg-gray-300 group-hover:scale-x-100'
                  }`}
                ></div>
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
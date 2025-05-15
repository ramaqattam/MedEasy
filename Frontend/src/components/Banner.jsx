// Banner.jsx
import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { colorTheme } from './ColorTheme';

const Banner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('banner-section');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const handleNavigation = () => {
    console.log('Navigating to /login');
    window.scrollTo(0, 0);
    // In a real implementation, navigate('/login') would be called here
  };

  return (
    <div 
      id="banner-section"
      className={`relative flex bg-gradient-to-r ${colorTheme.secondary.gradient} rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 overflow-hidden shadow-xl`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-40 h-40 rounded-full bg-white opacity-5 -top-10 -right-10 animate-pulse" style={{animationDuration: '6s'}}></div>
        <div className="absolute w-64 h-64 rounded-full bg-white opacity-5 -bottom-20 -left-20 animate-pulse" style={{animationDuration: '8s'}}></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-white border-dashed opacity-10 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-10 h-10 border-2 border-white border-dashed opacity-10 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
      </div>

      {/* Left side banner */}
      <div 
        className={`flex-1 py-6 sm:py-8 md:py-10 lg:py-12 lg:p1-5 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
        }`}
      >
        <div className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white'>
          <p className="drop-shadow-md">Book Appointment</p>
          <p 
            className='mt-4 transition-all duration-500 transform'
            style={{
              transitionDelay: '300ms',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            Get the care you deserve with certified and compassionate doctors
          </p>
        </div>
        
        <button 
          onClick={handleNavigation}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className='relative overflow-hidden bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 shadow-md hover:shadow-lg transition-all duration-500 transform group'
          style={{
            transitionDelay: '600ms',
            opacity: isVisible ? 1 : 0,
            transform: isVisible 
              ? isHovered ? 'translateY(-5px) scale(1.05)' : 'translateY(0) scale(1)' 
              : 'translateY(20px) scale(0.9)'
          }}
        >
          <span className="relative z-10 transition-all duration-300 group-hover:text-white">
            Create Account
          </span>
          <div 
            className={`absolute inset-0 bg-gradient-to-r ${colorTheme.secondary.gradient} transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100`}
          ></div>
          
          {/* Animated dots */}
          {isHovered && (
            <>
              <div className={`absolute top-1 right-1 w-1 h-1 rounded-full bg-amber-300 animate-ping`}></div>
              <div className={`absolute bottom-1 left-1 w-1 h-1 rounded-full bg-orange-300 animate-ping`} style={{animationDelay: '0.2s'}}></div>
            </>
          )}
        </button>
      </div>
      
      {/* Right side banner */}
      <div 
        className='hidden md:block md:w-1/2 lg:w-[370px] relative transition-all duration-1000 transform'
        style={{
          transitionDelay: '300ms',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(50px)'
        }}
      >
        <img 
          className='w-full absolute bottom-0 right-0 max-w-md transition-all duration-500 transform hover:scale-105 hover:-translate-y-2' 
          src={assets.appointment_img} 
          alt="Appointment" 
        />
        
        {/* Floating elements */}
        <div 
          className={`absolute top-1/4 -left-4 bg-white rounded-lg shadow-lg p-2 w-16 h-16 flex items-center justify-center animate-float`}
          style={{animationDuration: '4s'}}
        >
          <div className={`text-xl font-bold ${colorTheme.secondary.text}`}>24/7</div>
        </div>
        
        <div 
          className="absolute top-1/2 -right-4 bg-white rounded-lg shadow-lg p-2 animate-float"
          style={{animationDelay: '1s', animationDuration: '5s'}}
        >
          <div className="flex items-center justify-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
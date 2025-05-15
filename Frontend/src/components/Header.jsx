// Header.jsx
import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { colorTheme } from "./ColorTheme";

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`flex flex-col md:flex-row flex-warp bg-gradient-to-r ${colorTheme.primary.gradient} rounded-lg px-6 md:px-10 lg:px-20 overflow-hidden relative`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-40 h-40 rounded-full bg-white opacity-10 top-10 right-20 animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute w-24 h-24 rounded-full bg-white opacity-10 bottom-20 left-10 animate-pulse" style={{animationDuration: '6s'}}></div>
        <div className="absolute w-32 h-32 rounded-full bg-white opacity-10 top-40 left-40 animate-pulse" style={{animationDuration: '5s'}}></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-1/3 right-1/3 w-16 h-16 border-2 border-white border-dashed opacity-5 rounded-full animate-spin" style={{animationDuration: '15s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 border-2 border-white border-dashed opacity-5 rounded-full animate-spin" style={{animationDuration: '10s', animationDirection: 'reverse'}}></div>
      </div>

      {/*-----------left side header------------------*/}
      <div 
        className={`md:w-1/2 flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px] transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{transitionDelay: '300ms'}}
      >
        <p className="text-3xl md:text-4xl lg:text-3xl text-white font-semibold leading-tight md:leading-tight drop-shadow-md">
          Book Appointment <br /> With The Best Professional Doctors
        </p>
        <div 
          className={`flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light my-5 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{transitionDelay: '600ms'}}
        >
          <div className="relative">
            <img className="w-12 animate-bounce" style={{animationDuration: '3s'}} src={assets.group_profiles} alt="" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" style={{animationDuration: '2s'}}></div>
          </div>
          <p className="text-center md:text-left">
            Schedule your appointment with a distinguished team of experts from
            diverse specialties <br className="hidden sm:block" />
          </p>
        </div>
        
        
        <a
          href="#speciality"
          className={`flex items-center max-w-[215px] gap-2 bg-white hover:bg-amber-50 px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-110 transition-all duration-300 shadow-lg transform group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{transitionDelay: '900ms'}}
        >
          <span className={`transition-colors duration-300 group-hover:${colorTheme.secondary.text}`}>Book Appointment</span>
          <img className="w-3 animate-pulse group-hover:translate-x-1 transition-transform duration-300" src={assets.arrow_icon} alt="" />
        </a>
      </div>

      {/*-----------Right side header------------------*/}
      <div className={`md:w-1/2 flex relative transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-emerald-900 opacity-20 rounded-lg"></div>
        <img
          className="w-full md:absolute bottom-0 h-auto rounded-lg shadow-2xl hover:scale-105 transition-all duration-500"
          src={assets.header_img}
          alt="Doctor with patient"
        />
        
        {/* Floating elements */}
        <div className="absolute top-10 right-5 hidden md:block">
          <div className={`bg-white p-2 rounded-lg shadow-lg transform rotate-3 animate-float`} style={{animationDuration: '4s'}}>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 ${colorTheme.primary.background} rounded-full`}></div>
              <span className="text-xs font-medium">Online Consultations</span>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-16 left-5 hidden md:block">
          <div className={`bg-white p-2 rounded-lg shadow-lg transform -rotate-2 animate-float`} style={{animationDuration: '5s', animationDelay: '1s'}}>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 ${colorTheme.secondary.background} rounded-full`}></div>
              <span className="text-xs font-medium">Verified Doctors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
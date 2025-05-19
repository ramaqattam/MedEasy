import React from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="h-12 w-auto cursor-pointer"
        src={assets.MainLogoFinal}
        alt=""
      />

      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={assets.profile_pic} alt="Profile" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-emerald-600 border border-emerald-600 px-6 py-2 rounded-full hover:bg-emerald-50 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-primary text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
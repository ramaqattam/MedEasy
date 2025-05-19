import React, { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext'
import axios from "axios";
import { toast } from "react-hot-toast"; // Optional, for nice notifications

const API_BASE_URL = "http://localhost:4000/api/patient"; // Adjust to your backend URL

const MyProfile = () => {
  const { currentUser, token } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("/api/placeholder/150/150");
  const [imageFile, setImageFile] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
  });
  const [error, setError] = useState("");

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          const { patient } = response.data;
          setUserData({
            name: patient.name || "",
            email: patient.email || "",
            phone: patient.phone || "",
            dob: patient.dob || "",
            gender: patient.gender || ""
          });
          
          if (patient.image) {
            setProfileImage(patient.image);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        
        // If we have currentUser data from auth context, use that as fallback
        if (currentUser) {
          setUserData({
            name: currentUser.name || "",
            email: currentUser.email || "",
            // Other fields may not be available in currentUser
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [token, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add text fields
      Object.keys(userData).forEach(key => {
        formData.append(key, userData[key]);
      });
      
      // Add image if changed
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // Send update request
      const response = await axios.put(`${API_BASE_URL}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        // Update profile image if returned
        if (response.data.patient.image) {
          setProfileImage(response.data.patient.image);
        }
        
        setEditing(false);
        setImageFile(null);
        toast?.success("Profile updated successfully") || alert("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile. Please try again.");
      toast?.error("Failed to update profile") || alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Save file for upload
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="p-6 mb-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 mb-20">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-12 transition-all duration-300">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-md">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={profileImage}
              alt={userData.name || "Profile"}
              className="w-24 h-24 rounded-full object-cover shadow border-2 border-white"
            />
            {editing && (
              <label className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  aria-label="Upload profile image"
                />
              </label>
            )}
          </div>
          <h2 className="text-2xl font-semibold mt-4">{userData.name}</h2>
          <p className="text-gray-500">{userData.email}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            {editing ? (
              <input
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            ) : (
              <p className="text-gray-800">{userData.name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            {editing ? (
              <input
                name="email"
                type="email"
                value={userData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            ) : (
              <p className="text-gray-800">{userData.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            {editing ? (
              <input
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            ) : (
              <p className="text-gray-800">{userData.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            {editing ? (
              <input
                type="date"
                name="dob"
                value={formatDateForInput(userData.dob)}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            ) : (
              <p className="text-gray-800">
                {formatDate(userData.dob)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            {editing ? (
              <select
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="Not Selected">Prefer not to say</option>
              </select>
            ) : (
              <p className="text-gray-800">
                {userData.gender === "male" ? "Male" : 
                 userData.gender === "female" ? "Female" : 
                 "Not specified"}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setEditing(!editing)}
            disabled={saving}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              editing
                ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>

          {editing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
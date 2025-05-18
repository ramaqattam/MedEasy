import React, { useState, useEffect, useContext } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import MainApp from '../components/MainApp';
import { 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaUpload 
} from 'react-icons/fa';

const Profile = () => {
  const { dToken, doctorInfo, loginDoctor } = useContext(DoctorContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    speciality: '',
    degree: '',
    experience: '',
    about: '',
    fees: '',
    address: { line1: '', line2: '' },
    available: true
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (doctorInfo) {
      setProfileData({
        name: doctorInfo.name || '',
        email: doctorInfo.email || '',
        speciality: doctorInfo.speciality || '',
        degree: doctorInfo.degree || '',
        experience: doctorInfo.experience || '',
        about: doctorInfo.about || '',
        fees: doctorInfo.fees || '',
        address: doctorInfo.address || { line1: '', line2: '' },
        available: doctorInfo.available ?? true
      });
      setImagePreview(doctorInfo.Image || null);
    }
  }, [doctorInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: { 
          ...prev[parent], 
          [child]: value 
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      // Append all profile data
      Object.keys(profileData).forEach(key => {
        if (key === 'address') {
          formData.append(key, JSON.stringify(profileData[key]));
        } else {
          formData.append(key, profileData[key]);
        }
      });
      
      // Append image if changed
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const { data } = await axios.put(
        `/api/doctor/profile/${doctorInfo.id}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            dtoken: dToken
          }
        }
      );
      
      if (data.success) {
        // Update doctor info in context
        loginDoctor(dToken, {
          ...doctorInfo,
          ...data.doctor
        });
        
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const cancelEditing = () => {
    // Reset to original data
    if (doctorInfo) {
      setProfileData({
        name: doctorInfo.name || '',
        email: doctorInfo.email || '',
        speciality: doctorInfo.speciality || '',
        degree: doctorInfo.degree || '',
        experience: doctorInfo.experience || '',
        about: doctorInfo.about || '',
        fees: doctorInfo.fees || '',
        address: doctorInfo.address || { line1: '', line2: '' },
        available: doctorInfo.available ?? true
      });
      setImagePreview(doctorInfo.Image || null);
      setImageFile(null);
    }
    setIsEditing(false);
  };

  if (!doctorInfo) {
    return (
      <MainApp>
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </MainApp>
    );
  }

  return (
    <MainApp>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {isEditing ? 'Edit Profile' : 'My Profile'}
          </h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaEdit className="mr-2" /> Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={cancelEditing}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
              >
                <FaSave className="mr-2" /> Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 md:mr-6 relative">
              <img 
                src={imagePreview || '/default-avatar.png'} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <label className="cursor-pointer text-white flex items-center">
                    <FaUpload className="mr-2" />
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    Change Photo
                  </label>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profileData.name}</h2>
              <p className="text-gray-600">{profileData.email}</p>
              <p className="text-sm text-gray-500">{profileData.speciality}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                ) : (
                  <p className="text-gray-800">{profileData.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                ) : (
                  <p className="text-gray-800">{profileData.email}</p>
                )}
              </div>

              {/* Speciality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Speciality
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="speciality"
                    value={profileData.speciality}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                ) : (
                  <p className="text-gray-800">{profileData.speciality}</p>
                )}
              </div>

              {/* Degree */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="degree"
                    value={profileData.degree}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                ) : (
                  <p className="text-gray-800">{profileData.degree}</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="experience"
                    value={profileData.experience}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                ) : (
                  <p className="text-gray-800">{profileData.experience} years</p>
                )}
              </div>

              {/* Fees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consultation Fees
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="fees"
                    value={profileData.fees}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                ) : (
                  <p className="text-gray-800">₹{profileData.fees}</p>
                )}
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address.line1"
                    value={profileData.address.line1}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <p className="text-gray-800">
                    {profileData.address.line1 || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Address Line 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address.line2"
                    value={profileData.address.line2}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <p className="text-gray-800">
                    {profileData.address.line2 || 'Not provided'}
                  </p>
                )}
              </div>
            </div>

            {/* About Section (Full Width) */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About
              </label>
              {isEditing ? (
                <textarea
                  name="about"
                  value={profileData.about}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  required
                />
              ) : (
                <p className="text-gray-800">{profileData.about}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </MainApp>
  );
};

export default Profile;
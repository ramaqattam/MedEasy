import React, { useState } from "react";

const MyProfile = () => {

  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("/api/placeholder/150/150");
  const [userData, setUserData] = useState({
    name: "Maria Mass",
    email: "maria.mass@example.com",
    phone: "+962 780 780 133",
    dateOfBirth: "2001-03-16",
    gender: "Female",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = () => {
    setEditing(false);
    alert("Profile saved!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 mb-20">

    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-12 transition-all duration-300">
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={profileImage}
            alt="Pic Of Profile"
            className="w-16 h-16 rounded-full object-cover shadow border-2 border-white"
          />
          {editing && (
            <input
              type="file"
              onChange={handleImageChange}
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs mt-2"
              aria-label="Upload profile image"
            />
          )}
        </div>
        <h2 className="text-2xl  mt-4">{userData.name}</h2>
        
      </div>

      <div className="space-y-4">
        {[
          { label: "Full Name", name: "name" },
          { label: "Email", name: "email" },
          { label: "Phone", name: "phone" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {editing ? (
              <input
                name={name}
                value={userData[name]}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            ) : (
              <p className="text-gray-800">{userData[name]}</p>
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          {editing ? (
            <input
              type="date"
              name="dateOfBirth"
              value={userData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          ) : (
            <p className="text-gray-800">
              {new Date(userData.dateOfBirth).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
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
              <option>Male</option>
              <option>Female</option>
            </select>
          ) : (
            <p className="text-gray-800">{userData.gender}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => setEditing(!editing)}
          className={`px-5 py-2 rounded-lg font-medium transition ${
            editing
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-emerald-500 text-white hover:bg-emerald-600"
          }`}
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>

        {editing && (
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition"
          >
            Save
          </button>
        )}
      </div>
    </div>
    </div>
  );
};

export default MyProfile;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { colorTheme } from "../components/ColorTheme";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { doctors as fallbackDoctors } from "../assets/assets"; // Import fallback data

const API_BASE_URL = "http://localhost:4000/api/patient";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, token } = useAuth();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [useFallbackData, setUseFallbackData] = useState(false);

  // Get next 14 days for date selection
  const getNextFourteenDays = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push(nextDate);
    }
    
    return dates;
  };

  // Format date as YYYY-MM-DD
  const formatDateForApi = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Fetch doctor details and available slots
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        
        let doctorData = null;
        
        try {
          // Try to fetch doctor details from API
          const response = await axios.get(`${API_BASE_URL}/doctors/${docId}`);
          
          if (response.data.success) {
            doctorData = response.data.doctor;
          } else {
            throw new Error("Failed to fetch doctor details");
          }
        } catch (err) {
          console.error("Error fetching doctor details:", err);
          // Use fallback data if API call fails
          const fallbackDoctor = fallbackDoctors.find(d => d._id === docId || d._id.toString() === docId);
          
          if (fallbackDoctor) {
            doctorData = fallbackDoctor;
            setUseFallbackData(true);
          } else {
            throw new Error("Doctor not found");
          }
        }
        
        setDoctor(doctorData);
        
        // If we have a selected date, fetch available slots
        if (selectedDate) {
          fetchAvailableSlots(doctorData._id, selectedDate);
        }
      } catch (err) {
        console.error("Error in fetchDoctorDetails:", err);
        setError("Failed to load doctor details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctorDetails();
  }, [docId]);

  // Fetch available slots when date changes
  const fetchAvailableSlots = async (doctorId, date) => {
    try {
      setAvailableSlots([]);
      
      if (!date) return;
      
      if (useFallbackData) {
        // Use fallback slots if in fallback mode
        const mockSlots = [
          "09:00 AM", "10:00 AM", "11:00 AM", 
          "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
        ];
        
        // Randomly disable some slots to simulate booking
        setAvailableSlots(
          mockSlots.filter(() => Math.random() > 0.3)
        );
        return;
      }
      
      const formattedDate = formatDateForApi(new Date(date));
      
      const response = await axios.get(
        `${API_BASE_URL}/doctors/${doctorId}/available-slots/${formattedDate}`
      );
      
      if (response.data.success) {
        setAvailableSlots(response.data.availableSlots);
      } else {
        throw new Error("Failed to fetch available slots");
      }
    } catch (err) {
      console.error("Error fetching available slots:", err);
      setError("Failed to load available slots. Please try again later.");
      
      // Use fallback slots if API call fails
      const fallbackSlots = [
        "09:00 AM", "10:00 AM", "11:00 AM", 
        "01:00 PM", "02:00 PM", "03:00 PM"
      ];
      setAvailableSlots(fallbackSlots);
    }
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(""); // Reset selected slot when date changes
    
    if (doctor?._id) {
      fetchAvailableSlots(doctor._id, date);
    }
  };

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedSlot) {
      setBookingError("Please select both date and time slot");
      return;
    }
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login", { state: { from: `/appointment/${docId}` } });
      return;
    }
    
    try {
      setBookingLoading(true);
      setBookingError("");
      
      if (useFallbackData) {
        // Simulate successful booking in fallback mode
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBookingSuccess(true);
        return;
      }
      
      // Book appointment through API
      const formattedDate = formatDateForApi(new Date(selectedDate));
      
      const response = await axios.post(
        `${API_BASE_URL}/book-appointment`, 
        {
          doctorId: doctor._id,
          date: formattedDate,
          slot: selectedSlot,
          symptoms: symptoms
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setBookingSuccess(true);
      } else {
        throw new Error(response.data.message || "Failed to book appointment");
      }
    } catch (err) {
      console.error("Error booking appointment:", err);
      setBookingError(err.response?.data?.message || err.message || "Failed to book appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  // Handle navigation to appointments or redirect to home
  const handleViewAppointments = () => {
    navigate("/my-appointments");
  };

  const handleBookAnother = () => {
    navigate("/doctors");
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={() => navigate("/doctors")}
          className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="text-red-500 text-xl mb-4">Doctor not found</div>
        <button 
          onClick={() => navigate("/doctors")}
          className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Booked!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment with Dr. {doctor.name} on {formatDateForDisplay(selectedDate)} at {selectedSlot} has been confirmed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleViewAppointments}
              className={`px-6 py-3 rounded-md bg-gradient-to-r ${colorTheme.primary.gradient} text-white font-medium hover:shadow-lg transition-all`}
            >
              View My Appointments
            </button>
            <button
              onClick={handleBookAnother}
              className="px-6 py-3 rounded-md bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {useFallbackData && (
        <div className="max-w-5xl mx-auto mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                Using demo data. The connection to the server could not be established.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorTheme.primary.gradient}`}>
            Book an Appointment
          </h1>
          <p className="mt-2 text-gray-600">
            Schedule your appointment with Dr. {doctor.name}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-56">
                <img 
                  className="w-full h-full object-cover" 
                  src={doctor.Image || doctor.image || "/api/placeholder/400/300"} 
                  alt={doctor.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/api/placeholder/400/300";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm bg-emerald-500 inline-block px-2 py-1 rounded-full mb-2">
                    {doctor.available !== false ? "Available" : "Limited Availability"}
                  </div>
                  <h2 className="text-2xl font-bold">{doctor.name}</h2>
                  <p className="text-emerald-200">{doctor.speciality}</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">About Doctor</h3>
                  <p className="text-gray-600">
                    {doctor.about || `Dr. ${doctor.name} is a highly skilled ${doctor.speciality} specialist with ${doctor.experience} years of experience in the field.`}
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Qualifications</h3>
                  <p className="text-gray-600">
                    {doctor.degree || `${doctor.speciality} Specialist`}
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Experience</h3>
                  <p className="text-gray-600">{doctor.experience} years</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Consultation Fee</h3>
                  <p className="text-gray-600">₹{doctor.fees || "Consultation fee varies"}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Book Your Appointment</h2>
              
              {bookingError && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{bookingError}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {!isAuthenticated && (
                <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        You need to be logged in to book an appointment. 
                        <button
                          onClick={() => navigate("/login", { state: { from: `/appointment/${docId}` } })}
                          className="ml-2 font-medium underline"
                        >
                          Log in now
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {getNextFourteenDays().map((date, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDateSelect(date)}
                        className={`p-2 rounded-md text-center text-sm transition-colors ${
                          selectedDate && date.toDateString() === new Date(selectedDate).toDateString()
                            ? `bg-gradient-to-r ${colorTheme.primary.gradient} text-white`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="block font-medium">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="block mt-1">
                          {date.toLocaleDateString('en-US', { day: 'numeric' })}
                        </span>
                        <span className="block text-xs">
                          {date.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Time Slot Selection */}
                {selectedDate && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time Slot
                    </label>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSlotSelect(slot)}
                            className={`p-2 rounded-md text-center text-sm transition-colors ${
                              selectedSlot === slot
                                ? `bg-gradient-to-r ${colorTheme.primary.gradient} text-white`
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No available slots for this date.</p>
                    )}
                  </div>
                )}
                
                {/* Symptoms */}
                <div className="mb-6">
                  <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Symptoms (Optional)
                  </label>
                  <textarea
                    id="symptoms"
                    rows={4}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md p-2 focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="Please describe your symptoms or reason for visit..."
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={bookingLoading || !isAuthenticated}
                    className={`w-full py-3 px-4 rounded-md bg-gradient-to-r ${colorTheme.primary.gradient} text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {bookingLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Booking...
                      </>
                    ) : (
                      "Book Appointment"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
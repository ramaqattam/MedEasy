import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:4000/api/patient";

const MyAppointments = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!isAuthenticated) {
        navigate("/login", { state: { from: "/my-appointments" } });
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/my-appointments`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setAppointments(response.data.appointments || []);
        } else {
          throw new Error(response.data.message || "Failed to fetch appointments");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(err.response?.data?.message || err.message || "Failed to load your appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [isAuthenticated, navigate, token]);

  // Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      setCancellingId(appointmentId);
      
      const response = await axios.put(
        `${API_BASE_URL}/cancel-appointment/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Update the local state after successful cancellation
        setAppointments(appointments.map(appt => 
          appt._id === appointmentId 
            ? { ...appt, status: 'cancelled' } 
            : appt
        ));
        setSuccessMessage("Appointment cancelled successfully");
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        throw new Error(response.data.message || "Failed to cancel appointment");
      }
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      setError(err.response?.data?.message || err.message || "Failed to cancel appointment");
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setCancellingId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Status badge style
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">My Appointments</h2>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments booked yet</h3>
          <p className="mt-1 text-sm text-gray-500">Schedule your first appointment with one of our doctors.</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate('/doctors')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Find Doctors
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="border rounded-lg shadow-sm bg-white overflow-hidden"
            >
              <div className="p-5">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="flex mb-4 sm:mb-0">
                    <div className="flex-shrink-0 mr-4">
                      <img 
                        src={appointment.doctor?.Image || "/api/placeholder/60/60"} 
                        alt={appointment.doctor?.name || "Doctor"} 
                        className="h-16 w-16 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/api/placeholder/60/60";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{appointment.doctor?.name || "Doctor"}</h3>
                      <p className="text-sm text-gray-500 mb-1">{appointment.doctor?.speciality || "Specialist"}</p>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(appointment.status)}`}>
                          {appointment.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end">
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-medium">Date:</span> {formatDate(appointment.date)}
                    </p>
                    <p className="text-sm text-gray-700 mb-4">
                      <span className="font-medium">Time:</span> {appointment.slot}
                    </p>
                    
                    <div className="flex gap-2">
                      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                        <>
                          <button
                            onClick={() => alert("Redirecting to payment gateway...")}
                            className="px-4 py-2 text-sm rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors duration-200"
                          >
                            Pay Online
                          </button>
                          
                          <button
                            onClick={() => cancelAppointment(appointment._id)}
                            disabled={cancellingId === appointment._id}
                            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancellingId === appointment._id ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Cancelling...
                              </span>
                            ) : (
                              "Cancel"
                            )}
                          </button>
                        </>
                      )}
                      
                      {appointment.status === 'cancelled' && (
                        <span className="px-4 py-2 text-sm rounded-md text-gray-500 italic">
                          Appointment Cancelled
                        </span>
                      )}
                      
                      {appointment.status === 'completed' && (
                        <button
                          onClick={() => navigate(`/appointment/${appointment.doctor?._id}`)}
                          className="px-4 py-2 text-sm rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                        >
                          Book Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {appointment.symptoms && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Symptoms/Reason:</h4>
                    <p className="text-sm text-gray-600">{appointment.symptoms}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {appointments.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/doctors')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Book Another Appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
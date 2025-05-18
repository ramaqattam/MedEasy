import React, { useState, useEffect, useContext } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaCalendarCheck, 
  FaUserInjured, 
  FaClipboardList, 
  FaUserClock,
  FaEye,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availabilityStatus, setAvailabilityStatus] = useState(true);
  
  const { dToken, doctorInfo, loginDoctor } = useContext(DoctorContext);
  
  useEffect(() => {
    if (doctorInfo) {
      fetchDoctorStats();
      setAvailabilityStatus(doctorInfo.available ?? true);
    }
  }, [doctorInfo]);
  
  const fetchDoctorStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/doctor/stats/${doctorInfo.id}`,
        {
          headers: {
            dtoken: dToken
          }
        }
      );
      
      if (data.success) {
        setStats(data.stats);
      } else {
        toast.error(data.message || 'Failed to fetch stats');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateAvailability = async () => {
    try {
      const newStatus = !availabilityStatus;
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/doctor/availability/${doctorInfo.id}`, 
        { available: newStatus },
        {
          headers: {
            dtoken: dToken
          }
        }
      );
      
      if (data.success) {
        setAvailabilityStatus(newStatus);
        
        // Update doctor info in context with complete doctorInfo object
        const updatedDoctorInfo = {
          ...doctorInfo,
          available: newStatus
        };
        
        // Make sure the loginDoctor function updates the context properly
        loginDoctor(dToken, updatedDoctorInfo);
        
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Failed to update availability');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };
  
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleUpdateAppointmentStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `/api/appointment/doctor/appointment/${appointmentId}`,
        { status },
        {
          headers: {
            dtoken: dToken
          }
        }
      );
      
      if (data.success) {
        toast.success(`Appointment ${status} successfully`);
        // Refresh the data after status update
        fetchDoctorStats();
      } else {
        toast.error(data.message || 'Failed to update appointment');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Doctor Dashboard</h1>
        <div className="flex items-center">
          <span className="mr-3 text-sm">
            {availabilityStatus ? 'Available' : 'Unavailable'}
          </span>
          <button 
            onClick={handleUpdateAvailability}
            className={`px-3 py-1 rounded-full text-white text-sm flex items-center ${
              availabilityStatus 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {availabilityStatus 
              ? <FaCheckCircle className="mr-2" /> 
              : <FaTimesCircle className="mr-2" />
            }
            {availabilityStatus ? 'Mark Unavailable' : 'Mark Available'}
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : stats ? (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FaCalendarCheck className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Appointments</p>
                <p className="text-2xl font-semibold">{stats.totalAppointments}</p>
              </div>
            </div>
          
            
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <FaClipboardList className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Appointments</p>
                <p className="text-2xl font-semibold">{stats.pendingAppointments}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FaUserClock className="text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-semibold">{stats.completedAppointments}</p>
              </div>
            </div>
          </div>
          
          {/* Today's Appointments */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Today's Appointments</h2>
            </div>
            
            <div className="p-6">
              {stats.todayAppointments && stats.todayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {stats.todayAppointments.map(appointment => (
                    <div 
                      key={appointment._id} 
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          {appointment.patient && (
                            <img 
                              src={appointment.patient.Image || '/default-avatar.png'} 
                              alt={appointment.patient?.name || 'Patient'} 
                              className="w-full h-full object-cover"
                              onError={(e) => {e.target.src = '/default-avatar.png'}}
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{appointment.patient?.name || 'Unknown Patient'}</p>
                          <p className="text-sm text-gray-500">
                            {appointment.slot}
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                              appointment.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md flex items-center"
                          onClick={() => handleUpdateAppointmentStatus(appointment._id, 'completed')}
                        >
                          <FaEye className="mr-1" /> Complete
                        </button>
                        <button 
                          className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md flex items-center"
                          onClick={() => handleUpdateAppointmentStatus(appointment._id, 'cancelled')}
                        >
                          <FaTimesCircle className="mr-1" /> Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No appointments for today</p>
              )}
            </div>
          </div>
          
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
            </div>
            
            <div className="p-6">
              {stats.upcomingAppointments && stats.upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {stats.upcomingAppointments.map(appointment => (
                    <div 
                      key={appointment._id} 
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          {appointment.patient && (
                            <img 
                              src={appointment.patient.Image || '/default-avatar.png'} 
                              alt={appointment.patient?.name || 'Patient'} 
                              className="w-full h-full object-cover"
                              onError={(e) => {e.target.src = '/default-avatar.png'}}
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{appointment.patient?.name || 'Unknown Patient'}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(appointment.date)} - {appointment.slot}
                          </p>
                        </div>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">Failed to load dashboard data</p>
      )}
    </div>
  );
};

export default Dashboard;
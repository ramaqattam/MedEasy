import React, { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { 
    FaEye, 
    FaTimes, 
    FaChevronLeft, 
    FaChevronRight, 
    FaPlus,
    FaCheck,
    FaTimes as FaTimesCircle,
    FaBars
  } from 'react-icons/fa'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [formData, setFormData] = useState({
    doctorId: '',
    patientId: '',
    date: '',
    slot: '',
    symptoms: '',
    status: 'pending'
  })

  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [appointmentsPerPage] = useState(10)
  const [filterStatus, setFilterStatus] = useState('all')
  
  const { aToken, backendUrl } = useContext(AdminContext)

  useEffect(() => {
    fetchAppointments()
    fetchDoctors()
    fetchPatients()
  }, [currentPage, filterStatus])

  const formatDateShort = (dateString) => {
    const options = { month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: {
          atoken: aToken
        }
      })
      
      if (data.success) {
        let filteredAppointments = data.appointments
        
        // Apply status filter
        if (filterStatus !== 'all') {
          filteredAppointments = filteredAppointments.filter(
            app => app.status === filterStatus
          )
        }
        
        // Calculate pagination
        const totalAppointments = filteredAppointments.length
        setTotalPages(Math.ceil(totalAppointments / appointmentsPerPage))
        
        // Get current page of appointments
        const indexOfLastAppointment = currentPage * appointmentsPerPage
        const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage
        const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment)
        
        setAppointments(currentAppointments)
      } else {
        toast.error(data.message || 'Failed to fetch appointments')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/doctors`, {
        headers: {
          atoken: aToken
        }
      })
      
      if (data.success) {
        // Only get available doctors
        const availableDoctors = data.doctors.filter(doctor => doctor.available)
        setDoctors(availableDoctors)
      } else {
        toast.error(data.message || 'Failed to fetch doctors')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  const fetchPatients = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/patients`, {
        headers: {
          atoken: aToken
        }
      })
      
      if (data.success) {
        setPatients(data.patients)
      } else {
        toast.error(data.message || 'Failed to fetch patients')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  const fetchAvailableSlots = async (doctorId, date) => {
    try {
      if (!doctorId || !date) return
      
      const { data } = await axios.get(
        `${backendUrl}/api/admin/available-slots/${doctorId}/${date}`, 
        {
          headers: {
            atoken: aToken
          }
        }
      )
      
      if (data.success) {
        setAvailableSlots(data.availableSlots)
      } else {
        toast.error(data.message || 'Failed to fetch available slots')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // If doctor or date changes, fetch available slots
    if (name === 'doctorId' && formData.date) {
      fetchAvailableSlots(value, formData.date)
    }
    
    if (name === 'date' && formData.doctorId) {
      fetchAvailableSlots(formData.doctorId, value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.doctorId || !formData.patientId || !formData.date || !formData.slot) {
      return toast.error('Please fill all required fields')
    }
    
    try {
      const response = await axios.post(
        `${backendUrl}/api/admin/appointment`, 
        formData,
        {
          headers: {
            atoken: aToken
          }
        }
      )
      
      const { data } = response
      
      if (data.success) {
        toast.success('Appointment created successfully')
        setShowModal(false)
        resetForm()
        fetchAppointments()
      } else {
        toast.error(data.message || 'Failed to create appointment')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // Check if current status is completed or cancelled - if so, don't allow changes
      const appointment = appointments.find(app => app._id === id);
      if (appointment && (appointment.status === 'completed' || appointment.status === 'cancelled')) {
        toast.error(`Cannot change status of ${appointment.status} appointments`);
        return;
      }
      
      const response = await axios.put(
        `${backendUrl}/api/admin/appointment/${id}`,
        { status: newStatus },
        {
          headers: {
            atoken: aToken
          }
        }
      )
      
      const { data } = response
      
      if (data.success) {
        toast.success(`Appointment ${newStatus} successfully`)
        fetchAppointments()
        
        // If viewing details, update the selected appointment
        if (selectedAppointment && selectedAppointment._id === id) {
          setSelectedAppointment({
            ...selectedAppointment,
            status: newStatus
          })
        }
      } else {
        toast.error(data.message || 'Failed to update appointment')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  const resetForm = () => {
    setFormData({
      doctorId: '',
      patientId: '',
      date: '',
      slot: '',
      symptoms: '',
      status: 'pending'
    })
    setAvailableSlots([])
  }

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment)
    setShowDetailsModal(true)
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Helper function to check if status can be changed
  const canChangeStatus = (status) => {
    return status !== 'completed' && status !== 'cancelled';
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      <div className="flex flex-1">



        <div className="flex-1 p-4 md:p-6">
   

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Appointments</h1>
            <div className="flex flex-col sm:flex-row w-full md:w-auto items-start sm:items-center gap-3">
              <div className="w-full sm:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button
                className="w-full sm:w-auto bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                onClick={() => setShowModal(true)}
              >
                <FaPlus />
                New Appointment
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No appointments found.</p>
            </div>
          ) : (
            <>
              {/* Desktop view - Regular table */}
              <div className="hidden md:block overflow-x-auto mb-6">
                <table className="min-w-full bg-white rounded-lg shadow">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Patient</th>
                      <th className="py-3 px-6 text-left">Doctor</th>
                      <th className="py-3 px-6 text-left">Date</th>
                      <th className="py-3 px-6 text-left">Time</th>
                      <th className="py-3 px-6 text-center">Status</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {appointments.map((appointment) => (
                      <tr key={appointment._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                              <img
                                src={appointment.patient.Image}
                                alt={appointment.patient.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.patient.name}</p>
                              <p className="text-xs text-gray-500">{appointment.patient.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-left whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                              <img
                                src={appointment.doctor.Image}
                                alt={appointment.doctor.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.doctor.name}</p>
                              <p className="text-xs text-gray-500">{appointment.doctor.speciality}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-left">{formatDate(appointment.date)}</td>
                        <td className="py-3 px-6 text-left">{appointment.slot}</td>
                        <td className="py-3 px-6 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex justify-center items-center space-x-3">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              title="View Details"
                              onClick={() => handleViewDetails(appointment)}
                            >
                              <FaEye />
                            </button>
                            
                            {/* Only show action buttons if status is pending or confirmed */}
                            {canChangeStatus(appointment.status) && (
                              <>
                                {appointment.status !== 'completed' && (
                                  <button
                                    className="text-blue-500 hover:text-blue-700"
                                    title="Mark as Completed"
                                    onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                                  >
                                    <FaCheck />
                                  </button>
                                )}
                                
                                {appointment.status !== 'cancelled' && (
                                  <button
                                    className="text-red-500 hover:text-red-700"
                                    title="Cancel Appointment"
                                    onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
                                  >
                                    <FaTimesCircle />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile view - Card-based layout */}
              <div className="md:hidden space-y-4 mb-6">
                {appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-white rounded-lg shadow p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img
                            src={appointment.patient.Image}
                            alt={appointment.patient.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{appointment.patient.name}</p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <div className="w-4 h-4 rounded-full overflow-hidden mr-1">
                              <img
                                src={appointment.doctor.Image}
                                alt={appointment.doctor.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span>Dr. {appointment.doctor.name}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm mb-3">
                      <div>
                        <p className="text-gray-500">Date & Time</p>
                        <p className="font-medium">{formatDateShort(appointment.date)}, {appointment.slot}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-right">Speciality</p>
                        <p className="font-medium">{appointment.doctor.speciality}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                      <button
                        className="flex items-center text-blue-500 hover:text-blue-700"
                        onClick={() => handleViewDetails(appointment)}
                      >
                        <FaEye className="mr-1" />
                        <span>Details</span>
                      </button>

                      {canChangeStatus(appointment.status) && (
                        <div className="flex space-x-2">
                          {appointment.status !== 'completed' && (
                            <button
                              className="p-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                              onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                            >
                              <FaCheck />
                            </button>
                          )}
                          
                          {appointment.status !== 'cancelled' && (
                            <button
                              className="p-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                              onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
                            >
                              <FaTimesCircle />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center mt-4">
                <button
                  className="mx-1 px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft />
                </button>

                {/* Hide page numbers on smaller screens */}
                <div className="hidden sm:flex">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`mx-1 px-3 py-1 rounded-md ${currentPage === page
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Show current page info on mobile */}
                <div className="sm:hidden mx-2">
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <button
                  className="mx-1 px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <FaChevronRight />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Create Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Schedule New Appointment</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.name} - {doctor.speciality}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                  <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient._id} value={patient._id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                  <select
                    name="slot"
                    value={formData.slot}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={!formData.doctorId || !formData.date}
                  >
                    <option value="">Select Time Slot</option>
                    {availableSlots.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {(!formData.doctorId || !formData.date) && (
                    <p className="text-sm text-gray-500 mt-1">
                      Select doctor and date to see available slots
                    </p>
                  )}
                  {formData.doctorId && formData.date && availableSlots.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      No available slots for this date
                    </p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms/Notes</label>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    rows="3"
                    placeholder="Describe symptoms or reason for visit"
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
                  disabled={!formData.doctorId || !formData.patientId || !formData.date || !formData.slot}
                >
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* View Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Appointment Details</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowDetailsModal(false)
                  setSelectedAppointment(null)
                }}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-start mb-6">
                <div className="flex flex-col items-center mr-6 mb-4 md:mb-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-2">
                    <img 
                      src={selectedAppointment.patient.Image} 
                      alt={selectedAppointment.patient.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="font-medium text-gray-800">{selectedAppointment.patient.name}</p>
                  <p className="text-sm text-gray-500">Patient</p>
                </div>
                
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Doctor</p>
                      <div className="flex items-center mt-1">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                          <img 
                            src={selectedAppointment.doctor.Image} 
                            alt={selectedAppointment.doctor.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">Dr. {selectedAppointment.doctor.name}</p>
                          <p className="text-xs text-gray-500">{selectedAppointment.doctor.speciality}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Appointment ID</p>
                      <p className="font-medium">{selectedAppointment._id}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-medium">
                        {formatDate(selectedAppointment.date)} at {selectedAppointment.slot}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(selectedAppointment.status)}`}>
                        {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Symptoms/Notes</p>
                    <p className="font-medium">
                      {selectedAppointment.symptoms || 'No symptoms provided'}
                    </p>
                  </div>
                  
                  {selectedAppointment.notes && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Doctor's Notes</p>
                      <p className="font-medium">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Only show status update options if appointment isn't completed or cancelled */}
              {canChangeStatus(selectedAppointment.status) && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAppointment.status !== 'completed' && (
                      <button
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200"
                        onClick={() => handleUpdateStatus(selectedAppointment._id, 'completed')}
                      >
                        Mark as Completed
                      </button>
                    )}
                    
                    {selectedAppointment.status !== 'cancelled' && (
                      <button
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
                        onClick={() => handleUpdateStatus(selectedAppointment._id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* If appointment is completed or cancelled, show message instead */}
              {!canChangeStatus(selectedAppointment.status) && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 italic">
                    This appointment is {selectedAppointment.status} and its status cannot be changed.
                  </p>
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={() => {
                    setShowDetailsModal(false)
                    setSelectedAppointment(null)
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments
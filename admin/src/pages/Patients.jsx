import React, { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { FaUser, FaEdit, FaTrash, FaEye, FaTimes, FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa'

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'Not Selected',
    dob: '',
    phone: '',
    address: { line1: '', line2: '' },
    image: null
  })
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [patientsPerPage] = useState(10)
  
  const { aToken, backendUrl } = useContext(AdminContext)

  useEffect(() => {
    fetchPatients()
  }, [currentPage])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/admin/patients`, {
        headers: {
          atoken: aToken
        }
      })
      
      if (data.success) {
        // Calculate pagination
        const totalPatients = data.patients.length
        setTotalPages(Math.ceil(totalPatients / patientsPerPage))
        
        // Get current page of patients
        const indexOfLastPatient = currentPage * patientsPerPage
        const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
        const currentPatients = data.patients.slice(indexOfFirstPatient, indexOfLastPatient)
        
        setPatients(currentPatients)
      } else {
        toast.error(data.message || 'Failed to fetch patients')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.name || !formData.email || (!showEditModal && !formData.password)) {
      return toast.error('Please fill all required fields')
    }

    if (formData.password && formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters')
    }
    
    try {
      const form = new FormData()
      form.append('name', formData.name)
      form.append('email', formData.email)
      if (formData.password) {
        form.append('password', formData.password)
      }
      form.append('gender', formData.gender)
      form.append('dob', formData.dob)
      form.append('phone', formData.phone)
      form.append('address', JSON.stringify(formData.address))
      if (formData.image && typeof formData.image !== 'string') {
        form.append('image', formData.image)
      }
  
      let response

      if (showEditModal) {
        // Update patient
        response = await axios.put(`${backendUrl}/api/admin/patient/${selectedPatient._id}`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            atoken: aToken
          }
        })
      } else {
        // Add new patient
        response = await axios.post(`${backendUrl}/api/admin/patient`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            atoken: aToken
          }
        })
      }
  
      const { data } = response
  
      if (data.success) {
        toast.success(showEditModal ? 'Patient updated successfully' : 'Patient added successfully')
        setShowModal(false)
        setShowEditModal(false)
        resetForm()
        fetchPatients()
      } else {
        toast.error(data.message || (showEditModal ? 'Failed to update patient' : 'Failed to add patient'))
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      gender: 'Not Selected',
      dob: '',
      phone: '',
      address: { line1: '', line2: '' },
      image: null
    })
    setImagePreview(null)
    setSelectedPatient(null)
  }

  const handleEdit = (patient) => {
    setSelectedPatient(patient)
    setFormData({
      name: patient.name,
      email: patient.email,
      password: '', // Don't prefill password
      gender: patient.gender || 'Not Selected',
      dob: patient.dob || '',
      phone: patient.phone || '',
      address: patient.address || { line1: '', line2: '' },
      image: null // Don't prefill image
    })
    setImagePreview(patient.Image)
    setShowEditModal(true)
  }

  const handleView = (patient) => {
    setSelectedPatient(patient)
    setShowViewModal(true)
  }

  const handleDeletePatient = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        const response = await axios.delete(`${backendUrl}/api/admin/patient/${id}`, {
          headers: {
            atoken: aToken
          }
        })
        
        if (response.data.success) {
          toast.success('Patient deleted successfully')
          fetchPatients()
        } else {
          toast.error(response.data.message || 'Failed to delete patient')
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong')
      }
    }
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Not Selected") return "Not Provided";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      <div className="flex flex-1">

        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Patients</h1>
            <button 
              className="bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center gap-2"
              onClick={() => setShowModal(true)}
            >
              <FaPlus />
              Add New Patient
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : patients.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No patients found. Add your first patient!</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white rounded-lg shadow">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Patient</th>
                      <th className="py-3 px-6 text-left">Gender</th>
                      <th className="py-3 px-6 text-left">Date of Birth</th>
                      <th className="py-3 px-6 text-left">Phone</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {patients.map((patient) => (
                      <tr key={patient._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                              <img 
                                src={patient.Image} 
                                alt={patient.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-xs text-gray-500">{patient.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-left">{patient.gender || 'Not Provided'}</td>
                        <td className="py-3 px-6 text-left">{formatDate(patient.dob)}</td>
                        <td className="py-3 px-6 text-left">{patient.phone || 'Not Provided'}</td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex justify-center items-center space-x-3">
                            <button 
                              className="text-blue-500 hover:text-blue-700"
                              title="View Details"
                              onClick={() => handleView(patient)}
                            >
                              <FaEye />
                            </button>
                            <button 
                              className="text-yellow-500 hover:text-yellow-700"
                              title="Edit Patient"
                              onClick={() => handleEdit(patient)}
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="text-red-500 hover:text-red-700"
                              title="Delete Patient"
                              onClick={() => handleDeletePatient(patient._id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`mx-1 px-3 py-1 rounded-md ${
                      currentPage === page 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                
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
      
      {/* Add/Edit Patient Modal */}
      {(showModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">{showEditModal ? 'Edit Patient' : 'Add New Patient'}</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowModal(false)
                  setShowEditModal(false)
                  resetForm()
                }}
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {showEditModal && '(Leave blank to keep current)'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required={!showEditModal}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Not Selected">Not Selected</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                  <input
                    type="text"
                    name="address.line1"
                    value={formData.address.line1}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                  <input
                    type="text"
                    name="address.line2"
                    value={formData.address.line2}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image {showEditModal && '(Leave blank to keep current)'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded-md"
                  />
                  
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={() => {
                    setShowModal(false)
                    setShowEditModal(false)
                    resetForm()
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
                >
                  {showEditModal ? 'Update Patient' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* View Patient Modal */}
      {showViewModal && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Patient Details</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowViewModal(false)
                  setSelectedPatient(null)
                }}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
                  <img 
                    src={selectedPatient.Image} 
                    alt={selectedPatient.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{selectedPatient.name}</h3>
                  <p className="text-gray-600 mb-2">{selectedPatient.email}</p>
                  <p className="text-gray-500 text-sm">Patient ID: {selectedPatient._id}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="font-medium">{selectedPatient.gender || 'Not Provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="font-medium">{formatDate(selectedPatient.dob)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="font-medium">{selectedPatient.phone || 'Not Provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="font-medium">
                    {selectedPatient.address?.line1 ? (
                      <>
                        {selectedPatient.address.line1}
                        {selectedPatient.address.line2 && (
                          <>, {selectedPatient.address.line2}</>
                        )}
                      </>
                    ) : (
                      'Not Provided'
                    )}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Registered On</p>
                  <p className="font-medium">
                    {selectedPatient.createdAt 
                      ? new Date(selectedPatient.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Not Available'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 mr-2"
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(selectedPatient);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={() => {
                    setShowViewModal(false)
                    setSelectedPatient(null)
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

export default Patients
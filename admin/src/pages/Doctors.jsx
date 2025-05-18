import React, { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { FaUserMd, FaEdit, FaTrash, FaEye, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    speciality: '',
    degree: '',
    experience: '',
    about: '',
    fees: '',
    address: { line1: '', line2: '' },
    available: true,
    image: null
  })
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [doctorsPerPage] = useState(10)
  
  const { aToken, backendUrl } = useContext(AdminContext)

  useEffect(() => {
    fetchDoctors()
  }, [currentPage])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/admin/doctors`, {
        headers: {
          atoken: aToken
        }
      })
      
      if (data.success) {
        // Calculate pagination
        const totalDoctors = data.doctors.length
        setTotalPages(Math.ceil(totalDoctors / doctorsPerPage))
        
        // Get current page of doctors
        const indexOfLastDoctor = currentPage * doctorsPerPage
        const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage
        const currentDoctors = data.doctors.slice(indexOfFirstDoctor, indexOfLastDoctor)
        
        setDoctors(currentDoctors)
      } else {
        toast.error(data.message || 'Failed to fetch doctors')
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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      [name]: checked
    })
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
    if (!formData.name || !formData.email || (!showEditModal && !formData.password) || 
        !formData.speciality || !formData.degree || !formData.experience || 
        !formData.about || !formData.fees || (!showEditModal && !formData.image)) {
      return toast.error('Please fill all required fields')
    }
    
    try {
      const form = new FormData()
      form.append('name', formData.name)
      form.append('email', formData.email)
      if (formData.password) {
        form.append('password', formData.password)
      }
      form.append('speciality', formData.speciality)
      form.append('degree', formData.degree)
      form.append('experience', formData.experience)
      form.append('about', formData.about)
      form.append('fees', formData.fees)
      form.append('address', JSON.stringify(formData.address))
      form.append('available', formData.available)
      if (formData.image) {
        form.append('image', formData.image)
      }

      let response

      if (showEditModal) {
        // Update doctor
        response = await axios.put(`${backendUrl}/api/admin/doctor/${selectedDoctor._id}`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            atoken: aToken
          }
        })
      } else {
        // Add new doctor
        form.append('date', Date.now()) // Current timestamp - only needed for new doctors
        response = await axios.post(`${backendUrl}/api/admin/add-doctor`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            atoken: aToken
          }
        })
      }

      const { data } = response

      if (data.success) {
        toast.success(showEditModal ? 'Doctor updated successfully' : 'Doctor added successfully')
        setShowModal(false)
        setShowEditModal(false)
        resetForm()
        fetchDoctors()
      } else {
        toast.error(data.message || (showEditModal ? 'Failed to update doctor' : 'Failed to add doctor'))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      speciality: '',
      degree: '',
      experience: '',
      about: '',
      fees: '',
      address: { line1: '', line2: '' },
      available: true,
      image: null
    })
    setImagePreview(null)
    setSelectedDoctor(null)
  }

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor)
    setFormData({
      name: doctor.name,
      email: doctor.email,
      password: '', // Don't prefill password
      speciality: doctor.speciality,
      degree: doctor.degree,
      experience: doctor.experience,
      about: doctor.about,
      fees: doctor.fees,
      address: doctor.address || { line1: '', line2: '' },
      available: doctor.available,
      image: null // Don't prefill image
    })
    setImagePreview(doctor.Image)
    setShowEditModal(true)
  }

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        // Implement the delete functionality if needed
        toast.success('Doctor deleted successfully')
        fetchDoctors()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete doctor')
      }
    }
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      <div className="flex flex-1">

        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Doctors</h1>
            <button 
              className="bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center gap-2"
              onClick={() => setShowModal(true)}
            >
              <FaUserMd />
              Add New Doctor
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No doctors found. Add your first doctor!</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white rounded-lg shadow">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Doctor</th>
                      <th className="py-3 px-6 text-left">Speciality</th>
                      <th className="py-3 px-6 text-left">Experience</th>
                      <th className="py-3 px-6 text-left">Fees</th>
                      <th className="py-3 px-6 text-center">Status</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {doctors.map((doctor) => (
                      <tr key={doctor._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                              <img 
                                src={doctor.Image} 
                                alt={doctor.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{doctor.name}</p>
                              <p className="text-xs text-gray-500">{doctor.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-left">{doctor.speciality}</td>
                        <td className="py-3 px-6 text-left">{doctor.experience}</td>
                        <td className="py-3 px-6 text-left">₹{doctor.fees}</td>
                        <td className="py-3 px-6 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {doctor.available ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex justify-center items-center space-x-3">
                          
                            <button 
                              className="text-yellow-500 hover:text-yellow-700"
                              title="Edit Doctor"
                              onClick={() => handleEdit(doctor)}
                            >
                              <FaEdit />
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
      
      {/* Add/Edit Doctor Modal */}
      {(showModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">{showEditModal ? 'Edit Doctor' : 'Add New Doctor'}</h2>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
                  <input
                    type="text"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                    placeholder="e.g., 5 years"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fees</label>
                  <input
                    type="number"
                    name="fees"
                    value={formData.fees}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
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
                    required
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
                
                <div className="md:col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Available for Appointments</label>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    rows="4"
                    required
                  ></textarea>
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
                    required={!showEditModal}
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
                  {showEditModal ? 'Update Doctor' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Doctors
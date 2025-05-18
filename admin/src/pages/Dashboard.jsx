import React, { useEffect, useState, useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaUsers, FaUserMd, FaCalendarCheck, FaChartLine } from 'react-icons/fa'

function Dashboard() {
  const { aToken, backendUrl } = useContext(AdminContext)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalPatients: 0,
      totalDoctors: 0,
      appointmentsToday: 0,
      revenueGrowth: '0%'
    },
    recentActivities: [],
    upcomingAppointments: []
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard-stats`, {
        headers: {
          atoken: aToken
        }
      })
      
      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message || 'Failed to fetch dashboard data')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                  <div className="rounded-full bg-blue-100 p-3 mr-4">
                    <FaUsers className="text-primary text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Patients</p>
                    <p className="text-2xl font-semibold">{dashboardData.stats.totalPatients}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <FaUserMd className="text-green-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Doctors</p>
                    <p className="text-2xl font-semibold">{dashboardData.stats.totalDoctors}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                  <div className="rounded-full bg-purple-100 p-3 mr-4">
                    <FaCalendarCheck className="text-purple-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Today's Appointments</p>
                    <p className="text-2xl font-semibold">{dashboardData.stats.appointmentsToday}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 flex items-center">
                  <div className="rounded-full bg-yellow-100 p-3 mr-4">
                    <FaChartLine className="text-yellow-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Revenue Growth</p>
                    <p className="text-2xl font-semibold">{dashboardData.stats.revenueGrowth}</p>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity and Appointments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {dashboardData.recentActivities.length > 0 ? (
                      dashboardData.recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center py-2 border-b border-gray-100">
                          <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                          <div>
                            <p className="text-sm">{activity.type}: {activity.name}</p>
                            <p className="text-xs text-gray-500">{activity.timeAgo}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No recent activities</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
                  <div className="space-y-4">
                    {dashboardData.upcomingAppointments.length > 0 ? (
                      dashboardData.upcomingAppointments.map((appointment, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-3">
                              <img 
                                src={appointment.patientImage} 
                                alt={appointment.patientName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{appointment.patientName}</p>
                              <p className="text-xs text-gray-500">
                                {appointment.time} - Dr. {appointment.doctorName}
                              </p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 text-xs rounded-full ${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No upcoming appointments</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
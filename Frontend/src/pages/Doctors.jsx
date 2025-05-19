import React, { useState, useEffect } from "react";
import { colorTheme } from "../components/ColorTheme";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { doctors as fallbackDoctors } from "../assets/assets"; // Import fallback data

// Base URL for API
const API_BASE_URL = "http://localhost:4000/api/patient";

const Doctors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isVisible, setIsVisible] = useState(true); // Set this to true by default
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState(["All"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);


  const doctorsPerPage = 10; 

  // Fetch all doctors and specialties on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Debugging request
        console.log("Fetching data from:", `${API_BASE_URL}/doctors`);
        
        // Try loading doctors
        let doctorsData = [];
        try {
          const doctorsResponse = await axios.get(`${API_BASE_URL}/doctors`);
          console.log("Doctors response:", doctorsResponse.data);
          
          if (doctorsResponse.data.success) {
            doctorsData = doctorsResponse.data.doctors || [];


          } else {
            console.warn("Doctors API returned success: false");
          }
        } catch (err) {
          console.error("Error fetching doctors:", err);

        }
        
        // Try loading specialties
        let specialtyData = ["All"];
        try {
          const specialtiesResponse = await axios.get(`${API_BASE_URL}/specialities`);
          console.log("Specialties response:", specialtiesResponse.data);
          
          if (specialtiesResponse.data.success) {
            specialtyData = ["All", ...specialtiesResponse.data.specialities];
          }
        } catch (err) {
          console.error("Error fetching specialties:", err);
          // If specialties fetch fails, extract them from doctors data
          const uniqueSpecialties = [...new Set(doctorsData.map(doc => doc.speciality))];
          specialtyData = ["All", ...uniqueSpecialties];
        }
        
        // Set the data
        setAllDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
        setSpecialties(specialtyData);
        
        // Check if there's a filter from navigation state
        if (location.state?.filter) {
          setActiveFilter(location.state.filter);
        }

        
      } catch (err) {
        console.error("Error in fetchData:", err);

        
        // Fall back to static data in a critical error
        setAllDoctors(fallbackDoctors);
        setFilteredDoctors(fallbackDoctors);
        const uniqueSpecialties = [...new Set(fallbackDoctors.map(doc => doc.speciality))];
        setSpecialties(["All", ...uniqueSpecialties]);
        
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [location.state]);

  // Apply filters when activeFilter or searchTerm changes
  useEffect(() => {
    let results = [...allDoctors];
    console.log("Filtering doctors, starting count:", results.length);

    if (activeFilter !== "All") {
      results = results.filter(doctor => doctor.speciality === activeFilter);
      console.log(`After filter by specialty "${activeFilter}":`, results.length);
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      results = results.filter(
        doctor =>
          doctor.name.toLowerCase().includes(lowerSearch) ||
          doctor.speciality.toLowerCase().includes(lowerSearch)
      );
      console.log(`After search term "${searchTerm}":`, results.length);
    }

    console.log("Final filtered doctors:", results);
    setFilteredDoctors(results);
    setCurrentPage(1); 
    
    
  }, [activeFilter, searchTerm, allDoctors]);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        console.log("Container is intersecting");
        setIsVisible(true);
      }
    }, { threshold: 0.1 });

    const element = document.getElementById('doctors-container');
    if (element) {
      observer.observe(element);
      console.log("Observer attached to doctors-container");
    } else {
      console.warn("Could not find doctors-container element");
    }

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * doctorsPerPage,
    currentPage * doctorsPerPage
  );

  const getColor = (index) => {
    const accentIndex = index % colorTheme.accent.length;
    return colorTheme.accent[accentIndex];
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  const handleDoctorSelection = (id) => {
    navigate(`/appointment/${id}`);
    window.scrollTo(0, 0);
  };
  

  if (loading) {
    return (
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorTheme.primary.gradient}`}>
          Our Expert Doctors
        </h1>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          Schedule appointments with top-rated medical professionals across various specialties
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-lg shadow-sm p-4">
          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full md:w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-end">
            {specialties.slice(0, 8).map((specialty) => (
              <button
                key={specialty}
                onClick={() => setActiveFilter(specialty)}
                className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                  activeFilter === specialty
                    ? `text-white bg-gradient-to-r ${colorTheme.primary.gradient} shadow-sm`
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {specialty}
              </button>
            ))}
            {specialties.length > 8 && (
              <div className="relative group">
                <button className="px-3 py-1 text-sm rounded-full text-gray-700 bg-gray-100 hover:bg-gray-200">
                  More +
                </button>
                <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-1">
                    {specialties.slice(8).map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => setActiveFilter(specialty)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div id="doctors-container" className={`max-w-7xl mx-auto`}> {/* Removed animation classes */}
        {paginatedDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedDoctors.map((doctor, index) => {
              const color = getColor(index);
              return (
                <div key={doctor._id || index} onClick={() => handleDoctorSelection(doctor._id || index)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg cursor-pointer border border-gray-200"
                  style={{ minHeight: "400px" }} // Force a minimum height
                >
                  <div className="relative">
                    <img 
                      className="w-full h-48 object-cover object-center bg-gray-100"  
                      src={doctor.Image || doctor.image || "/api/placeholder/150/150"} 
                      alt={doctor.name}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "/api/placeholder/150/150";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                    <div className={`absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium ${color.text}`}>
                      {doctor.speciality || "General"}
                    </div>
                    <div className="absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium bg-emerald-500 text-white">
                      {doctor.available !== false ? "Available" : "Unavailable"}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{doctor.name || "Doctor Name"}</h3>
                    <p className="text-sm text-gray-500">{doctor.experience || "Experience"} years experience</p>
                    <p className="text-sm text-gray-500 mt-1">₹{doctor.fees || "Consultation fee varies"}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleDoctorSelection(doctor._id || index);
                      }}
                      className={`w-full py-2 mt-4 rounded-lg bg-gradient-to-r ${color.gradient} text-white font-medium transition-all duration-300 hover:shadow-md`}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <div className={`inline-block p-6 rounded-full bg-gray-100 text-gray-500 mb-4`}>
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No doctors found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setActiveFilter("All");
                setSearchTerm("");
              }}
              className={`mt-4 px-4 py-2 rounded-md bg-gradient-to-r ${colorTheme.primary.gradient} text-white font-medium`}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Fallback cards display - just to ensure something shows up */}
      {paginatedDoctors.length === 0 && fallbackDoctors.length > 0 && (
        <div className="max-w-7xl mx-auto mt-8">
          <div className="bg-yellow-100 p-4 rounded-md mb-4">
            <h3 className="font-bold">Fallback Data (Debug Only):</h3>
            <p>Showing static data as a fallback since no doctors were found in API response.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {fallbackDoctors.slice(0, 4).map((doctor, index) => {
              const color = getColor(index);
              return (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md border border-yellow-300">
                  <div className="relative">
                    <img 
                      className="w-full h-48 object-cover object-center bg-gray-100" 
                      src={doctor.image} 
                      alt={doctor.name}
                    />
                    <div className={`absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-medium ${color.text}`}>
                      {doctor.speciality}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-sm text-gray-500">{doctor.experience}</p>
                    <button
                      className={`w-full py-2 mt-4 rounded-lg bg-gradient-to-r ${color.gradient} text-white font-medium`}
                    >
                      Book Appointment (STATIC)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto mt-8 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ◀
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === index + 1
                    ? `bg-gradient-to-r ${colorTheme.primary.gradient} text-white`
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ▶
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Doctors;
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from "date-fns/locale";
import { useAuth } from "../context/AuthContext";


const Register = () => {
  const navigate = useNavigate();
  const { registerPatient, error: authError, clearError, isAuthenticated } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: null,
    gender: "",
    termsAccepted: false,
    image: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [preview, setPreview] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Display auth errors
  useEffect(() => {
    if (authError) {
      setErrors({ general: authError });
    }
  }, [authError]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file" && files.length > 0) {
      const file = files[0];
      // Check if file is an image
      if (!file.type.match('image.*')) {
        setErrors({
          ...errors,
          [name]: "Please select an image file (jpg, png, etc.)"
        });
        return;
      }

      // Check file size
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        setErrors({
          ...errors,
          [name]: "Image file size should be less than 5MB"
        });
        return;
      }

      setFormData({
        ...formData,
        [name]: file
      });

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    if (name === 'password' || name === 'confirmPassword') {
      // Clear confirmPassword error if either password field changes
      if (errors.confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: ""
        });
      }
    }

    clearError();
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must agree to the terms and conditions";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare data for API
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        image: formData.image
      };

      const result = await registerPatient(userData);

      if (result.success) {
        setSuccessMessage(result.message || "Account created successfully!");
        // If auto-login is not enabled in the context, redirect to login
        if (!isAuthenticated) {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } else {
        setErrors({ general: result.message || "Registration failed" });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        general: error.message || "An error occurred during registration. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 py-6 px-6 text-white">
          <h2 className="text-2xl font-bold text-center">Create New Account</h2>
          <p className="text-center text-emerald-100 mt-2">
            Register as a patient to access MedEasy services
          </p>
        </div>

        <div className="py-8 px-6">
          {errors.general && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {errors.general}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Image */}
              <div className="md:col-span-2 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-emerald-300 flex items-center justify-center mb-2">
                  {preview ? (
                    <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <label
                  htmlFor="image"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-500 cursor-pointer"
                >
                  Upload Profile Photo
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
                {errors.image && (
                  <p className="mt-1 text-red-500 text-xs">{errors.image}</p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="mt-1 text-red-500 text-xs">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="+962 780 078 0133"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-red-500 text-xs">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : ""}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: new Date(e.target.value) })
                  }
                  className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-red-500 text-xs">{errors.dateOfBirth}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="**********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-red-500 text-xs">{errors.password}</p>



                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                      }`}
                    placeholder="************"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-red-500 text-xs">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.gender ? "border-red-500" : "border-gray-300"
                    }`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-red-500 text-xs">{errors.gender}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="termsAccepted" className="text-gray-700">
                  I agree to the{" "}

                  <a href="#"
                    className="text-emerald-600 hover:text-emerald-500"
                    onClick={(e) => {
                      e.preventDefault();
                      // In a real app, you might open a modal with terms here
                      alert("Terms and conditions would be displayed here.");
                    }}
                  >
                    Terms and Conditions
                  </a>
                </label>
                {errors.termsAccepted && (
                  <p className="mt-1 text-red-500 text-xs">
                    {errors.termsAccepted}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Account
                  </>
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-emerald-600 hover:text-emerald-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
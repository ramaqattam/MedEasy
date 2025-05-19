import validator from "validator";
import bycrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import dctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";  
import appointmentModel from "../models/appointmentModel.js"; 

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      speciality,
      degree,
      experience,
      about,
      fees,
    } = req.body;
    const imageFile = req.file;
    console.log(
      {
        name,
        email,
        password,
        address,
        speciality,
        degree,
        experience,
        about,
        fees,
      },
      imageFile
    );
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees
    ) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageUrl = imageUpload.secure_url;

     const doctoData = {
            name,
            email,
            password: hashedPassword,
            address:JSON.parse(address),
            speciality,
            degree,
            experience,
            about,
            fees,
            Image: imageUrl,  
            date: Date.now(),
     }

     const newDoctor = new dctorModel(doctoData)
      await newDoctor.save();

      res.json({success:true,message:"Doctor added successfully"})

  } catch (error) {
    console.log(error);
    res.json({ success:false,message:error.message });
  }
};

//API FOR ADMIN LOGIN
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign( email+password,process.env.JWT_SECRET)
     res.status(200).json({
        success: true,
        token,
      });
    }else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
     
    

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


const getAllDoctors = async (req, res) => {
  try {
    const doctors = await dctorModel.find({}).select('-password'); // Exclude passwords from response
    res.status(200).json({
      success: true,
      doctors
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      password,
      address,
      speciality,
      degree,
      experience,
      about,
      fees,
      available,
    } = req.body || {};  // Add fallback empty object here

    // Check if any data was received
    if (!req.body) {
      return res.status(400).json({ message: "No data received" });
    }

    if (
      !name ||
      !email ||
      !address ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees
    ) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    // Find the doctor
    const doctor = await dctorModel.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Update doctor data
    const updateData = {
      name,
      email,
      address: typeof address === 'string' ? JSON.parse(address) : address,
      speciality,
      degree,
      experience,
      about,
      fees,
      available: available !== undefined ? available : doctor.available,
    };

    // If password is provided, hash it
    if (password && password.length >= 6) {
      const salt = await bycrypt.genSalt(10);
      updateData.password = await bycrypt.hash(password, salt);
    }

    // If image is provided, upload it
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      updateData.Image = imageUpload.secure_url;
    }

    // Update the doctor
    const updatedDoctor = await dctorModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get dashboard statistics for admin
const getDashboardStats = async (req, res) => {
  try {
    // Get total number of patients
    const totalPatients = await userModel.countDocuments();
    
    // Get total number of doctors
    const totalDoctors = await dctorModel.countDocuments();
    
    // Get today's appointments count
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const appointmentsToday = await appointmentModel.countDocuments({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    // Calculate revenue growth (this is a placeholder - in a real app, you'd calculate this from actual financial data)
    // For example, comparing current month's revenue with previous month
    const revenueGrowth = await calculateRevenueGrowth();
    
    // Get recent activities (latest 5 patient registrations)
    const recentActivities = await userModel.find()
      .sort({ _id: -1 })
      .limit(5)
      .select('name createdAt');
    
    // Format recent activities
    const formattedActivities = recentActivities.map(activity => ({
      type: 'New patient registered',
      name: activity.name,
      time: activity.createdAt,
      timeAgo: getTimeAgo(activity.createdAt)
    }));
    
    // Get upcoming appointments (next 5 appointments)
    const upcomingAppointments = await appointmentModel.find({
      date: { $gte: today },
      status: { $in: ['pending', 'confirmed'] }
    })
    .sort({ date: 1 })
    .limit(5)
    .populate('doctor', 'name')
    .populate('patient', 'name Image');
    
    // Format upcoming appointments
    const formattedAppointments = upcomingAppointments.map(appointment => ({
      patientName: appointment.patient.name,
      patientImage: appointment.patient.Image,
      doctorName: appointment.doctor.name,
      time: appointment.slot,
      date: appointment.date,
      status: appointment.status
    }));
    
    // Construct and return the dashboard data
    res.status(200).json({
      success: true,
      dashboardData: {
        stats: {
          totalPatients,
          totalDoctors,
          appointmentsToday,
          revenueGrowth: `${revenueGrowth}%`
        },
        recentActivities: formattedActivities,
        upcomingAppointments: formattedAppointments
      }
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch dashboard statistics' 
    });
  }
};

// Helper function to calculate revenue growth (placeholder)
const calculateRevenueGrowth = async () => {
  try {
    // In a real app, you would calculate this from actual revenue data
    // This is just a placeholder implementation
    
    // For example, you might:
    // 1. Get completed appointments for current and previous month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Current month start/end
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);
    
    // Previous month start/end
    const prevMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const prevMonthEnd = new Date(currentYear, currentMonth, 0);
    
    // Get completed appointments for current month
    const currentMonthAppointments = await appointmentModel.find({
      date: { $gte: currentMonthStart, $lte: currentMonthEnd },
      status: 'completed'
    }).populate('doctor', 'fees');
    
    // Get completed appointments for previous month
    const prevMonthAppointments = await appointmentModel.find({
      date: { $gte: prevMonthStart, $lte: prevMonthEnd },
      status: 'completed'
    }).populate('doctor', 'fees');
    
    // Calculate revenue (assuming revenue = sum of doctors' fees for completed appointments)
    const currentMonthRevenue = currentMonthAppointments.reduce(
      (total, appointment) => total + (appointment.doctor ? appointment.doctor.fees : 0), 0
    );
    
    const prevMonthRevenue = prevMonthAppointments.reduce(
      (total, appointment) => total + (appointment.doctor ? appointment.doctor.fees : 0), 0
    );
    
    // Calculate growth percentage
    let growth = 0;
    if (prevMonthRevenue > 0) {
      growth = ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
    } else if (currentMonthRevenue > 0) {
      growth = 100; // If previous month had zero revenue, growth is 100%
    }
    
    // Return the growth percentage rounded to 1 decimal place
    return Math.round(growth * 10) / 10;
  } catch (error) {
    console.error("Error calculating revenue growth:", error);
    return 0; // Return 0% growth in case of error
  }
};

// Helper function to format time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHr > 0) {
    return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  } else if (diffMin > 0) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

// Update your export statement to include the new dashboard stats function
export { 
  addDoctor, 
  loginAdmin, 
  getAllDoctors, 
  updateDoctor, 
  getDashboardStats 
};
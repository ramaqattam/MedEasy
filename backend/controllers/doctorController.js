import validator from "validator";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// Doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Check password
    const isMatch = await bycrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Create token
    const token = jwt.sign(
      { id: doctor._id, email: doctor.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        speciality: doctor.speciality,
        image: doctor.Image
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor profile
const getDoctorProfile = async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const doctor = await doctorModel.findById(doctorId).select('-password');
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: "Doctor not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      doctor
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { name, email, speciality, degree, experience, about, fees, address, available } = req.body;
    
    // Validate required fields
    if (!name || !email || !speciality || !degree || !experience || !about || !fees) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }
    
    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please enter a valid email" 
      });
    }
    
    // Check if email already exists (for another doctor)
    const existingDoctor = await doctorModel.findOne({ email, _id: { $ne: doctorId } });
    if (existingDoctor) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already in use" 
      });
    }
    
    // Update doctor profile
    const updateData = {
      name,
      email,
      speciality,
      degree,
      experience,
      about,
      fees,
      available: available !== undefined ? available : true
    };
    
    if (address) {
      updateData.address = typeof address === 'string' ? JSON.parse(address) : address;
    }
    
    // If profile image is uploaded
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      updateData.Image = imageUpload.secure_url;
    }
    
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      updateData,
      { new: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      doctor: updatedDoctor
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor dashboard stats
const getDoctorStats = async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    // Check if doctor exists
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: "Doctor not found" 
      });
    }
    
    // Get appointments count by status
    const totalAppointments = await appointmentModel.countDocuments({ doctor: doctorId });
    const pendingAppointments = await appointmentModel.countDocuments({ 
      doctor: doctorId,
      status: 'pending'
    });
    const confirmedAppointments = await appointmentModel.countDocuments({ 
      doctor: doctorId,
      status: 'confirmed'
    });
    const completedAppointments = await appointmentModel.countDocuments({ 
      doctor: doctorId,
      status: 'completed'
    });
    const cancelledAppointments = await appointmentModel.countDocuments({ 
      doctor: doctorId,
      status: 'cancelled'
    });
    
    // Get unique patients count
    const uniquePatients = await appointmentModel.distinct('patient', { 
      doctor: doctorId,
      status: { $in: ['confirmed', 'completed'] }
    });
    
    // Get today's appointments
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const todayAppointments = await appointmentModel.find({
      doctor: doctorId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $in: ['pending', 'confirmed'] }
    }).populate('patient', 'name email Image').sort({ slot: 1 });
    
    // Get upcoming appointments (next 7 days excluding today)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);
    
    const upcomingAppointments = await appointmentModel.find({
      doctor: doctorId,
      date: {
        $gte: tomorrow,
        $lte: nextWeek
      },
      status: { $in: ['pending', 'confirmed'] }
    }).populate('patient', 'name email Image').sort({ date: 1, slot: 1 });
    
    res.status(200).json({
      success: true,
      stats: {
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        uniquePatientsCount: uniquePatients.length,
        todayAppointments,
        upcomingAppointments
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor's patients
const getDoctorPatients = async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    // Get unique patient IDs who have had appointments with this doctor
    const patientIds = await appointmentModel.distinct('patient', { 
      doctor: doctorId,
      status: { $in: ['confirmed', 'completed'] }
    });
    
    // Get patient details
    const patients = await userModel.find({ 
      _id: { $in: patientIds } 
    }).select('-password');
    
    // For each patient, get their appointment count with this doctor
    const patientsWithStats = await Promise.all(patients.map(async (patient) => {
      const appointmentCount = await appointmentModel.countDocuments({
        doctor: doctorId,
        patient: patient._id,
        status: { $in: ['confirmed', 'completed'] }
      });
      
      const lastAppointment = await appointmentModel.findOne({
        doctor: doctorId,
        patient: patient._id,
        status: { $in: ['confirmed', 'completed'] }
      }).sort({ date: -1 });
      
      return {
        ...patient.toObject(),
        appointmentCount,
        lastAppointmentDate: lastAppointment ? lastAppointment.date : null
      };
    }));
    
    res.status(200).json({
      success: true,
      patients: patientsWithStats
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update doctor availability
const updateAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { available } = req.body;
    
    // Validate availability status
    if (available === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "Availability status is required" 
      });
    }
    
    // Find doctor by ID using the model with the typo
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: "Doctor not found" 
      });
    }
    
    // Update availability status
    doctor.available = available;
    await doctor.save();
    
    // Return success response
    res.status(200).json({
      success: true,
      message: `You are now ${available ? 'available' : 'unavailable'} for appointments`,
      available
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }
    
    // Find appointment
    const appointment = await appointmentModel.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }
    
    // Check if appointment belongs to this doctor
    // if (appointment.doctor.toString() !== req.doctor.id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Not authorized to update this appointment"
    //   });
    // }
    
    // If appointment is already completed or cancelled, don't allow status change
    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status of ${appointment.status} appointments`
      });
    }
    
    // Update appointment status
    appointment.status = status;
    await appointment.save();
    
    res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get doctor's appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status } = req.query; // Optional status filter
    
    // Create the base query
    const query = { doctor: doctorId };
    
    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Fetch appointments with patient details
    const appointments = await appointmentModel.find(query)
      .populate('patient', 'name email phone Image gender')
      .sort({ date: -1, slot: 1 });
    
    res.status(200).json({
      success: true,
      appointments
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export { 
  loginDoctor, 
  getDoctorProfile, 
  updateDoctorProfile, 
  getDoctorStats, 
  getDoctorPatients,
  updateAvailability,
  getDoctorAppointments, 
  updateAppointmentStatus
};
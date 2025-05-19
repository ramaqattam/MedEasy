import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";

// Create new appointment
const createAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, date, slot, symptoms } = req.body;

    // Validate required fields
    if (!doctorId || !patientId || !date || !slot) {
      return res.status(400).json({ 
        success: false, 
        message: "Doctor ID, Patient ID, date and slot are required" 
      });
    }

    // Check if doctor exists
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: "Doctor not found" 
      });
    }

    // Check if doctor is available
    if (!doctor.available) {
      return res.status(400).json({ 
        success: false, 
        message: "Doctor is not available for appointments" 
      });
    }

    // Check if patient exists
    const patient = await userModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: "Patient not found" 
      });
    }

    // Check if slot is already booked
    const appointmentDate = new Date(date);
    const dateString = appointmentDate.toISOString().split('T')[0];
    
    // Convert slot to proper format if needed
    
    // Check if the slot is already booked for the doctor on that date
    const existingAppointment = await appointmentModel.findOne({
      doctor: doctorId,
      date: {
        $gte: new Date(`${dateString}T00:00:00.000Z`),
        $lt: new Date(`${dateString}T23:59:59.999Z`)
      },
      slot: slot,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        success: false, 
        message: "This slot is already booked" 
      });
    }

    // Create appointment
    const newAppointment = new appointmentModel({
      doctor: doctorId,
      patient: patientId,
      date: appointmentDate,
      slot,
      symptoms: symptoms || '',
      status: 'pending'
    });

    await newAppointment.save();

    // Update doctor's booked slots
    // This depends on your implementation, but here's a simple approach
    if (!doctor.slots_booked[dateString]) {
      doctor.slots_booked[dateString] = [];
    }
    doctor.slots_booked[dateString].push(slot);
    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment: await appointmentModel.findById(newAppointment._id)
        .populate('doctor', 'name email speciality Image')
        .populate('patient', 'name email Image')
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all appointments for admin
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
      .populate('doctor', 'name email speciality Image')
      .populate('patient', 'name email Image')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      appointments
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get appointments for a specific doctor
const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const appointments = await appointmentModel.find({ doctor: doctorId })
      .populate('patient', 'name email Image')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      appointments
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get appointments for a specific patient
const getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const appointments = await appointmentModel.find({ patient: patientId })
      .populate('doctor', 'name email speciality Image')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      appointments
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status" 
      });
    }
    
    const appointment = await appointmentModel.findById(id);
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: "Appointment not found" 
      });
    }
    
    // If appointment is being cancelled, update doctor's booked slots
    if (status === 'cancelled' && appointment.status !== 'cancelled') {
      const doctor = await doctorModel.findById(appointment.doctor);
      const dateString = appointment.date.toISOString().split('T')[0];
      
      if (doctor && doctor.slots_booked[dateString]) {
        doctor.slots_booked[dateString] = doctor.slots_booked[dateString].filter(
          slot => slot !== appointment.slot
        );
        await doctor.save();
      }
    }
    
    appointment.status = status;
    
    if (req.body.notes) {
      appointment.notes = req.body.notes;
    }
    
    await appointment.save();
    
    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment: await appointmentModel.findById(id)
        .populate('doctor', 'name email speciality Image')
        .populate('patient', 'name email Image')
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get available slots for a doctor on a specific date
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    
    // Check if doctor exists
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: "Doctor not found" 
      });
    }
    
    // Check if doctor is available
    if (!doctor.available) {
      return res.status(400).json({ 
        success: false, 
        message: "Doctor is not available for appointments" 
      });
    }
    
    // Define working hours and slots (example: 9 AM to 5 PM, 1-hour slots)
    const workingHours = [
      "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
      "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
    ];
    
    // Get booked slots for the doctor on the specified date
    const dateObj = new Date(date);
    const dateString = dateObj.toISOString().split('T')[0];
    
    const bookedAppointments = await appointmentModel.find({
      doctor: doctorId,
      date: {
        $gte: new Date(`${dateString}T00:00:00.000Z`),
        $lt: new Date(`${dateString}T23:59:59.999Z`)
      },
      status: { $ne: 'cancelled' }
    });
    
    const bookedSlots = bookedAppointments.map(app => app.slot);
    
    // Calculate available slots
    const availableSlots = workingHours.filter(slot => !bookedSlots.includes(slot));
    
    res.status(200).json({
      success: true,
      availableSlots,
      bookedSlots
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { 
  createAppointment, 
  getAllAppointments, 
  getDoctorAppointments, 
  getPatientAppointments,
  updateAppointmentStatus,
  getAvailableSlots
};
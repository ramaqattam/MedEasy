import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";

// 1. Get home page top doctors
const getTopDoctors = async (req, res) => {
    try {
        // Fetch top doctors sorted by ratings or number of appointments
        const topDoctors = await doctorModel.find({ available: true })
            .select('name speciality experience Image fees')
            .sort({ experience: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            topDoctors
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get all doctors with filters
const getAllDoctorsWithFilters = async (req, res) => {
    try {
      const { speciality, name, available, sortBy } = req.query;
  
      // Build query based on filters
      const query = {};
  
      if (speciality) {
        query.speciality = speciality;
      }
  
      if (name) {
        query.name = { $regex: name, $options: 'i' };
      }
  
      // ✅ Exclude unavailable doctors unless explicitly requested
      if (available === 'true') {
        query.available = true;
      } else if (available === 'false') {
        query.available = false;
      } else {
        query.available = true; // Default
      }
  
      // Sorting options
      let sortOptions = {};
      if (sortBy === 'fees-low-to-high') {
        sortOptions = { fees: 1 };
      } else if (sortBy === 'fees-high-to-low') {
        sortOptions = { fees: -1 };
      } else if (sortBy === 'experience-high') {
        sortOptions = { experience: -1 };
      } else {
        sortOptions = { name: 1 }; // Default
      }
  
      const doctors = await doctorModel.find(query)
        .select('-password')
        .sort(sortOptions);
  
      res.status(200).json({
        success: true,
        count: doctors.length,
        doctors
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

// 3. Book an appointment
const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, slot, symptoms } = req.body;

        // Validate required fields
        if (!doctorId || !date || !slot) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID, date and slot are required"
            });
        }

        // Get patient ID from JWT token
        const patientId = req.user.id;

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

        // Check if slot is already booked
        const appointmentDate = new Date(date);
        const dateString = appointmentDate.toISOString().split('T')[0];

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
        if (!doctor.slots_booked) {
            doctor.slots_booked = {};
        }

        if (!doctor.slots_booked[dateString]) {
            doctor.slots_booked[dateString] = [];
        }

        doctor.slots_booked[dateString].push(slot);
        await doctor.save();

        // Return appointment details with doctor and patient information
        const appointmentDetails = await appointmentModel.findById(newAppointment._id)
            .populate('doctor', 'name email speciality Image')
            .populate('patient', 'name email Image');

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            appointment: appointmentDetails
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Patient login
const loginPatient = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: 'patient' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.Image
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. View all appointments for logged in patient
const getPatientAppointments = async (req, res) => {
    try {
        const patientId = req.user.id;

        // Get all appointments for the patient
        const appointments = await appointmentModel.find({ patient: patientId })
            .populate('doctor', 'name speciality Image fees')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            appointments
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Cancel specific appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const patientId = req.user.id;

        // Find the appointment
        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        // Check if appointment belongs to the requesting patient
        if (appointment.patient.toString() !== patientId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to cancel this appointment"
            });
        }

        // Check if appointment can be cancelled (not completed)
        if (appointment.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel a completed appointment"
            });
        }

        // Update appointment status to cancelled
        appointment.status = 'cancelled';
        await appointment.save();

        // Free up the slot in doctor's booked slots
        const doctor = await doctorModel.findById(appointment.doctor);
        if (doctor) {
            const dateString = appointment.date.toISOString().split('T')[0];

            if (doctor.slots_booked && doctor.slots_booked[dateString]) {
                doctor.slots_booked[dateString] = doctor.slots_booked[dateString].filter(
                    slot => slot !== appointment.slot
                );
                await doctor.save();
            }
        }

        res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Register as user (patient)
const registerPatient = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            phoneNumber,
            dateOfBirth,
            gender
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        // Check if email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user object
        const userData = {
            name: fullName,
            email,
            password: hashedPassword,
            phone: phoneNumber || "",
            dob: dateOfBirth || null,
            gender: gender || "Not Selected",
            address: { line1: '', line2: '' }
        };

        // Handle image if uploaded
        if (req.file) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "image",
            });
            userData.Image = imageUpload.secure_url;
        }

        // Create new user
        const newUser = new userModel(userData);
        await newUser.save();

        // Generate token for auto login
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: 'patient' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                image: newUser.Image
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get doctor details by ID
const getDoctorDetails = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await doctorModel.findById(doctorId)
            .select('-password');

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

// Get available slots for a doctor
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

        // Define working hours and slots (9 AM to 5 PM, 1-hour slots)
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
            date: dateString,
            availableSlots,
            bookedSlots
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get list of specialities
const getSpecialities = async (req, res) => {
    try {
        // Get unique specialities from doctors collection
        const specialities = await doctorModel.distinct('speciality');

        res.status(200).json({
            success: true,
            specialities
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};



// Get patient profile
const getPatientProfile = async (req, res) => {
    try {
        const patientId = req.user.id;

        // Find patient by ID
        const patient = await userModel.findById(patientId).select('-password');

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.status(200).json({
            success: true,
            patient: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                phone: patient.phone,
                gender: patient.gender,
                dob: patient.dob,
                image: patient.Image || null,
                address: patient.address
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update patient profile
const updatePatientProfile = async (req, res) => {
    try {
        const patientId = req.user.id;
        const { name, email, phone, gender, dob } = req.body;

        // Find patient by ID
        const patient = await userModel.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        // Validate email if it's being changed
        if (email && email !== patient.email) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid email"
                });
            }

            // Check if new email is already in use
            const existingUser = await userModel.findOne({ email, _id: { $ne: patientId } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already in use"
                });
            }
        }

        // Update fields
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (gender) updateData.gender = gender;
        if (dob) updateData.dob = dob;

        // If image is uploaded, process it
        if (req.file) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "image",
            });
            updateData.Image = imageUpload.secure_url;
        }

        // Update patient record
        const updatedPatient = await userModel.findByIdAndUpdate(
            patientId,
            updateData,
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            patient: {
                id: updatedPatient._id,
                name: updatedPatient.name,
                email: updatedPatient.email,
                phone: updatedPatient.phone,
                gender: updatedPatient.gender,
                dob: updatedPatient.dob,
                image: updatedPatient.Image || null,
                address: updatedPatient.address
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    getPatientProfile,
    updatePatientProfile,
    getTopDoctors,
    getAllDoctorsWithFilters,
    bookAppointment,
    loginPatient,
    getPatientAppointments,
    cancelAppointment,
    registerPatient,
    getDoctorDetails,
    getAvailableSlots,
    getSpecialities
};
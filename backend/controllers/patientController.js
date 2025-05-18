
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";

// Get all patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await userModel.find({}).select('-password'); // Exclude passwords for security
    res.status(200).json({
      success: true,
      patients
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single patient by ID
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await userModel.findById(id).select('-password');
    
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    
    res.status(200).json({
      success: true,
      patient
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new patient
const addPatient = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      gender,
      dob,
      phone
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }
    
    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }
    
    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }
    
    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create patient object
    const patientData = {
      name,
      email,
      password: hashedPassword,
      address: address ? JSON.parse(address) : { line1: '', line2: '' },
      gender: gender || "Not Selected",
      dob: dob || "Not Selected",
      phone: phone || "0000000000"
    };
    
    // Handle image if uploaded
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      patientData.Image = imageUpload.secure_url;
    }
    
    // Create new patient
    const newPatient = new userModel(patientData);
    await newPatient.save();
    
    res.status(201).json({
      success: true,
      message: "Patient added successfully",
      patient: await userModel.findById(newPatient._id).select('-password')
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update patient
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      password,
      address,
      gender,
      dob,
      phone
    } = req.body || {};
    
    // Check if data was received
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "No data received" });
    }
    
    // Find patient
    const patient = await userModel.findById(id);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    
    // If email is being updated, validate it
    if (email && email !== patient.email) {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Please enter a valid email" });
      }
      
      // Check if email is already in use
      const existingUser = await userModel.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
    }
    
    // Create update object
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (address) updateData.address = typeof address === 'string' ? JSON.parse(address) : address;
    if (gender) updateData.gender = gender;
    if (dob) updateData.dob = dob;
    if (phone) updateData.phone = phone;
    
    // If password is provided, hash it
    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    } else if (password) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }
    
    // If image is provided, upload it
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      updateData.Image = imageUpload.secure_url;
    }
    
    // Update patient
    const updatedPatient = await userModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      patient: updatedPatient
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete patient
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    
    const patient = await userModel.findById(id);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    
    await userModel.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Patient deleted successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllPatients, getPatientById, addPatient, updatePatient, deletePatient };
// routes/adminRoute.js
import express from 'express';
import { addDoctor, getAllDoctors, getDashboardStats, loginAdmin, updateDoctor } from '../controllers/adminController.js';
import { getAllPatients, getPatientById, addPatient, updatePatient, deletePatient } from '../controllers/patientController.js';
import { 
  createAppointment, 
  getAllAppointments, 
  getDoctorAppointments, 
  getPatientAppointments,
  updateAppointmentStatus,
  getAvailableSlots 
} from '../controllers/appointmentController.js';
import { upload } from '../middlewares/multer.js';
import { authAdmin } from '../middlewares/authAdmin.js';

const adminRouter = express.Router();

// Doctor routes
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
adminRouter.get('/doctors', authAdmin, getAllDoctors);
adminRouter.put('/doctor/:id', authAdmin, upload.single('image'), updateDoctor);

// Patient routes
adminRouter.get('/patients', authAdmin, getAllPatients);
adminRouter.get('/patient/:id', authAdmin, getPatientById);
adminRouter.post('/patient', authAdmin, upload.single('image'), addPatient);
adminRouter.put('/patient/:id', authAdmin, upload.single('image'), updatePatient);
adminRouter.delete('/patient/:id', authAdmin, deletePatient);

// Appointment routes
adminRouter.get('/appointments', authAdmin, getAllAppointments);

adminRouter.put('/appointment/:id', authAdmin, updateAppointmentStatus);
adminRouter.post('/appointment', authAdmin, createAppointment);
adminRouter.get('/available-slots/:doctorId/:date', authAdmin, getAvailableSlots);

//Admin Dashboard statisics
adminRouter.get('/dashboard-stats', authAdmin, getDashboardStats);

// Admin routes
adminRouter.post('/login', loginAdmin);

export default adminRouter;
import express from 'express';
import { 
  loginDoctor, 
  getDoctorProfile, 
  updateDoctorProfile, 
  getDoctorStats, 
  getDoctorPatients,
  updateAvailability,
  updateAppointmentStatus,
  getDoctorAppointments
} from '../controllers/doctorController.js';
import { authDoctor } from '../middlewares/authDoctor.js';
import { upload } from '../middlewares/multer.js';
const doctorRouter = express.Router();

// Public routes
doctorRouter.post('/login', loginDoctor);

// Protected routes
doctorRouter.get('/profile/:doctorId', authDoctor, getDoctorProfile);
doctorRouter.put('/profile/:doctorId', authDoctor, upload.single('image'), updateDoctorProfile);
doctorRouter.get('/stats/:doctorId', authDoctor, getDoctorStats);
doctorRouter.get('/patients/:doctorId', authDoctor, getDoctorPatients);
doctorRouter.put('/availability/:doctorId', authDoctor, updateAvailability);



// Appointment routes
doctorRouter.get('/doctor-appointments/:doctorId', authDoctor, getDoctorAppointments);
doctorRouter.put('/appointment/:appointmentId', authDoctor, updateAppointmentStatus);

export default doctorRouter;
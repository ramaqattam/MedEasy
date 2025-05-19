import express from 'express';
import { 
  getTopDoctors,
  getAllDoctorsWithFilters,
  bookAppointment,
  loginPatient,
  getPatientAppointments,
  cancelAppointment,
  registerPatient,
  getDoctorDetails,
  getAvailableSlots,
  getSpecialities,
  getPatientProfile,
  updatePatientProfile
} from '../controllers/frontEndController.js';
import { upload } from '../middlewares/multer.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const patientRouter = express.Router();

// Public routes (no authentication required)
patientRouter.get('/top-doctors', getTopDoctors);
patientRouter.get('/doctors', getAllDoctorsWithFilters);
patientRouter.get('/doctors/:doctorId', getDoctorDetails);
patientRouter.get('/doctors/:doctorId/available-slots/:date', getAvailableSlots);
patientRouter.get('/specialities', getSpecialities);

// Authentication routes
patientRouter.post('/login', loginPatient);
patientRouter.post('/register', upload.single('image'), registerPatient);

patientRouter.get('/profile', authenticateUser, getPatientProfile);
patientRouter.put('/profile', authenticateUser, upload.single('image'), updatePatientProfile);
// Protected routes (authentication required)
patientRouter.post('/book-appointment', authenticateUser, bookAppointment);
patientRouter.get('/my-appointments', authenticateUser, getPatientAppointments);
patientRouter.put('/cancel-appointment/:appointmentId', authenticateUser, cancelAppointment);

export default patientRouter;
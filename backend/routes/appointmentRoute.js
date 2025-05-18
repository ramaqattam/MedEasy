import express from 'express';
import { 
  createAppointment, 
  getAllAppointments, 
  getDoctorAppointments, 
  getPatientAppointments,
  updateAppointmentStatus,
  getAvailableSlots
} from '../controllers/appointmentController.js';
import { authAdmin } from '../middlewares/authAdmin.js';

const appointmentRouter = express.Router();

// Admin routes
appointmentRouter.get('/appointments', authAdmin, getAllAppointments);
appointmentRouter.get('/doctor-appointments/:doctorId', authAdmin, getDoctorAppointments);
appointmentRouter.get('/patient-appointments/:patientId', authAdmin, getPatientAppointments);
appointmentRouter.put('/appointment/:id', authAdmin, updateAppointmentStatus);

// Common routes (will need patient auth in a real app)
appointmentRouter.post('/appointment', createAppointment);
appointmentRouter.get('/available-slots/:doctorId/:date', getAvailableSlots);
// Doctor routes
appointmentRouter.get('/doctor/:doctorId/appointments', authDoctor, getDoctorAppointments);
appointmentRouter.put('/doctor/appointment/:id', authDoctor, updateAppointmentStatus);
appointmentRouter.get('/doctor/:doctorId/available-slots/:date', getAvailableSlots);


export default appointmentRouter;
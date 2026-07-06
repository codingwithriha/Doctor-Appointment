import express from 'express';
import { addDoctor, allDoctors, appointmentAdmin, loginAdmin, appointmentCancel, adminDashboard } from '../controllers/adminController.js'; // Added appointmentCancel here
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from '../controllers/doctorController.js';
// Remove this line: import { cancelAppointment } from '../controllers/userController.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor',authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/all-doctor',authAdmin, allDoctors);
adminRouter.post('/change-availability',authAdmin, changeAvailability);
adminRouter.get('/appointments',authAdmin, appointmentAdmin);
adminRouter.post('/cancel-appointments',authAdmin, appointmentCancel);
adminRouter.get('/dashboard',authAdmin, adminDashboard);
export default adminRouter;
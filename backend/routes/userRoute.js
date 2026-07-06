import express from 'express'
import { 
  bookAppointment, 
  cancelAppointment, 
  getProfile, 
  createPaymentIntent, 
  confirmPayment, 
  handleStripeWebhook, 
  listAppointment,  // Fixed: was 'listAppointemnt', now 'listAppointment'
  loginUser, 
  registerUser, 
  updateProfile,
  getDoctorInfo  // Added this since you'll likely need it for the doctor info route
} from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)  // Fixed: was 'listAppointemnt', now 'listAppointment'
userRouter.post('/cancel-appointments', authUser, cancelAppointment)
userRouter.post('/create-payment-intent', authUser, createPaymentIntent)
userRouter.post('/confirm-payment', authUser, confirmPayment)
userRouter.post('/stripe-webhook', handleStripeWebhook)

// Add this route if you need to get individual doctor info (based on your frontend code)
userRouter.get('/doctor/:docId', getDoctorInfo)

export default userRouter
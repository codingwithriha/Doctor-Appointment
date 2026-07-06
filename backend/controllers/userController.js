import validator from "validator";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModels.js";
import appointmentModel from "../models/appointmentModel.js";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//api for register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    // Validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    // Check if user already exists
    const isExisting = await userModel.findOne({ email });
    if (isExisting) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//api for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//Api to get user profile data
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to update the user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    let parsedAddress = address;
    if (typeof address === "string") {
      try {
        parsedAddress = JSON.parse(address);
      } catch (e) {
        // If parsing fails, keep as string or handle as needed
      }
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    });

    if (imageFile) {
      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to get single doctor info
const getDoctorInfo = async (req, res) => {
  try {
    const { docId } = req.params;
    
    const doctor = await doctorModel.findById(docId).select("-password");
    
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, doctor });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//API to book appointment - FIXED VERSION
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!docId || !slotDate || !slotTime) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Always use string for slotDate and slotTime
    const slotDateKey = String(slotDate);
    const slotTimeStr = String(slotTime);

    // console.log("Booking request:", { docId, slotDateKey, slotTimeStr });

    // Check if doctor exists and is available
    const doctorData = await doctorModel.findById(docId);
    if (!doctorData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    // **CRITICAL: Check if doctor is available**
    if (!doctorData.available) {
      return res.json({ success: false, message: "Doctor is not available" });
    }

    // Check if an appointment already exists for this doctor, date, and time
    const existingAppointment = await appointmentModel.findOne({
      docId,
      slotDate: slotDateKey,
      slotTime: slotTimeStr,
      cancelled: { $ne: true },
    });

    if (existingAppointment) {
      return res.json({ success: false, message: "Slot not available" });
    }

    const bookedSlotsForDate = doctorData.slots_booked?.[slotDateKey] || [];

    // Normalize time format for comparison
    const normalizeTime = (timeStr) => {
      return timeStr.toLowerCase().replace(/\s+/g, "").replace(/^0/, "");
    };

    const normalizedRequestTime = normalizeTime(slotTimeStr);
    const normalizedBookedTimes = bookedSlotsForDate.map((time) =>
      normalizeTime(time)
    );

    if (normalizedBookedTimes.includes(normalizedRequestTime)) {
      return res.json({ success: false, message: "Slot already booked" });
    }

    // Double-check doctor availability before final booking (race condition protection)
    const finalCheck = await doctorModel.findById(docId);
    if (!finalCheck.available) {
      return res.json({ success: false, message: "Doctor is no longer available" });
    }

    // Atomically add slot to doctor's slots_booked - only if doctor is available
    const updateResult = await doctorModel.updateOne(
      { _id: docId, available: true }, // Only update if doctor is still available
      { $addToSet: { [`slots_booked.${slotDateKey}`]: slotTimeStr } }
    );

    // Check if the update was successful (doctor was available)
    if (updateResult.matchedCount === 0) {
      return res.json({ success: false, message: "Doctor is not available" });
    }

    // console.log("Doctor update result:", updateResult);

    // Fetch updated doctor and user data for appointment
    const docData = await doctorModel.findById(docId).select("-password");
    const userData = await userModel.findById(userId).select("-password");

    // Don't include slots_booked in appointment data to keep it clean
    const cleanDocData = { ...docData.toObject() };
    delete cleanDocData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData: cleanDocData,
      slotDate: slotDateKey,
      slotTime: slotTimeStr,
      amount: docData.fees,
      date: Date.now(),
      cancelled: false,
    };

    const newAppointment = new appointmentModel(appointmentData);
    const savedAppointment = await newAppointment.save();

    // console.log("Appointment saved:", savedAppointment._id);

    return res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.error("Booking error:", error);
    return res.json({ success: false, message: error.message });
  }
};

//API to get all list of user appointment for frontend my-appointment page
const listAppointment = async (req, res) => {
  try {
    const userId = req.userId;

    const appointment = await appointmentModel.find({ userId });

    res.json({ success: true, appointment });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//Api to cancel the appointment
const cancelAppointment = async (req, res) => {
  try {
    // Get userId from middleware (req.userId) and appointmentId from request body
    const userId = req.userId;
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Verify appointment user
    if (appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    // Update appointment to cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // Release doctor slot
    const { docId, slotDate, slotTime } = appointmentData;

    const docData = await doctorModel.findById(docId);

    if (docData && docData.slots_booked && docData.slots_booked[slotDate]) {
      let slots_booked = { ...docData.slots_booked };
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );

      await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    }

    return res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API to create Stripe payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Verify appointment belongs to user
    if (appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    // Check if appointment is already paid or cancelled
    if (appointmentData.payment || appointmentData.cancelled) {
      return res.json({ 
        success: false, 
        message: appointmentData.cancelled ? "Appointment is cancelled" : "Payment already completed"
      });
    }

    // **ADDED: Check if doctor is still available**
    const doctorData = await doctorModel.findById(appointmentData.docId);
    if (!doctorData || !doctorData.available) {
      return res.json({ 
        success: false, 
        message: "Doctor is no longer available" 
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: appointmentData.amount * 100, // Convert to cents
      currency: 'usd', // or your preferred currency
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        appointmentId: appointmentId,
        userId: userId,
        doctorName: appointmentData.docData.name,
        appointmentDate: appointmentData.slotDate,
        appointmentTime: appointmentData.slotTime
      },
    });

    return res.json({ 
      success: true, 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: appointmentData.amount
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API to confirm payment and update appointment
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, appointmentId } = req.body;
    const userId = req.userId;

    // Verify appointment belongs to user
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    // **ADDED: Check if doctor is still available**
    const doctorData = await doctorModel.findById(appointmentData.docId);
    if (!doctorData || !doctorData.available) {
      return res.json({ 
        success: false, 
        message: "Doctor is no longer available" 
      });
    }

    // Retrieve and verify payment from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Verify payment amount matches appointment
    if (paymentIntent.amount !== appointmentData.amount * 100) {
      return res.json({ success: false, message: "Payment amount mismatch" });
    }

    if (paymentIntent.status === 'succeeded') {
      // Update appointment as paid
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        payment: true,
        paymentIntentId: paymentIntentId,
        paymentStatus: 'completed',
        paymentDate: new Date()
      });

      return res.json({ 
        success: true, 
        message: "Payment completed successfully",
        paymentStatus: 'completed'
      });
    } else {
      return res.json({ 
        success: false, 
        message: "Payment not completed",
        paymentStatus: paymentIntent.status
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Webhook to handle Stripe events (optional but recommended)
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // If no webhook secret is configured, skip signature verification for now
  if (!webhookSecret) {
    // console.log('Webhook secret not configured, skipping signature verification');
    return res.json({ received: true, message: 'Webhook secret not configured' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    // console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // console.log('Payment succeeded:', paymentIntent.id);
      
      // Update appointment status
      if (paymentIntent.metadata.appointmentId) {
        await appointmentModel.findByIdAndUpdate(
          paymentIntent.metadata.appointmentId,
          {
            payment: true,
            paymentIntentId: paymentIntent.id,
            paymentStatus: 'completed'
          }
        );
      }
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      // console.log('Payment failed:', failedPayment.id);
      
      // Update appointment status
      if (failedPayment.metadata.appointmentId) {
        await appointmentModel.findByIdAndUpdate(
          failedPayment.metadata.appointmentId,
          {
            paymentStatus: 'failed'
          }
        );
      }
      break;
    
    default:
      // console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getDoctorInfo,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  createPaymentIntent,
  confirmPayment,
  handleStripeWebhook,
};
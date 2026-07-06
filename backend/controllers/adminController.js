
import validator from 'validator'
import bcrypt from 'bcryptjs'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModels.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'


// API for adding doctor
const addDoctor = async (req,res)=>{
    try {

//             console.log("Body received:", req.body);
// console.log("File received:", req.file);

        const {name ,email , password,speciality ,degree,experience,about ,fees ,address} = req.body
       const imageFile = req.file

       //checking for all data to add doctor 
       if(!name || !email || !password || !speciality || !degree || !experience || !about  ){
        return res.json({success:false, message :"Missing Details"})
       }

       //Validating email format 
       if (!validator.isEmail(email)) {
        return res.json({success:false, message:"Please enter a valid email "})
       }

       //Validating password 
       if (password.length < 8) {
         return res.json({success:false , message:"Please enter a strong password "
         })
       }
       
       //hashing  doctor password 
       const hashPassword = await bcrypt.hash(password, 10);



       //upload image from cloudinary 
       const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
       const imageUrl = imageUpload.secure_url

       const doctorData = {
        name,
        email,
        image:imageUrl,
        password:hashPassword,
        speciality,
        degree,
        experience,
        about,
        fees,
        address:JSON.parse(address),
        date:Date.now()
       }


       const newDoctor = new doctorModel(doctorData)

       await newDoctor.save()

       res.json({success:true, message:"Doctor added"})

   

    } catch (error) {
        console.log(error)
        return res.json({success:false,message:error.message})
    }
}

//API for admin login
const loginAdmin = async (req,res)=>{
  try {
    const {email,password} = req.body

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

      const token = jwt.sign(email+password,process.env.JWT_SECRET)
      res.json({success:true,token})

    }else{
      res.json({success:false,message:"Invalid Credentials"})
    }


  } catch (error) {
    console.log(error)
    return res.json({success:false,message:error.message})
  }
}

//API to get all doctors list for admin panel 

const allDoctors = async (req,res)=>{
  try {

    const doctors = await doctorModel.find({}).select('-password')
    res.json({success:true,doctors}) 
  } catch (error) {
    console.log(error)
    return res.json({success:false,message:error.message})
  }

}


// api to get all apointment list for admin panel
const appointmentAdmin = async (req,res)=>{ 

  try {
    
    const appointments = await appointmentModel.find({})
    res.json({success:true,appointments})
     

  } catch (error) {
    console.log(error)
    return res.json({success:false,message:error.message})
  }
}

//api for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {   
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


// api to get dashboard data for admin panel 
const adminDashboard = async(req,res)=>{

  try {

    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointment: appointments.reverse().slice(0,5)
    }

    res.json({success:true, dashData})
    
    
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
    
  }
}


export {addDoctor,loginAdmin,allDoctors,appointmentAdmin,appointmentCancel, adminDashboard}



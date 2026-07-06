import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js"; // adjust the path if needed


//Admin authentication middleware 
const authAdmin = async(req,res,next)=>{
    try {
        const {atoken} = req.headers
        if (!atoken) {
            return res.json({success:false,message:"NOt Authorized , Login Again"})
            
        }
        const token_decode = jwt.verify(atoken,process.env.JWT_SECRET)

        if (token_decode != process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({success:false,message:"Not Authorized, Login Again "})
        }
        next()
        
    } catch (error) {
         console.log(error)
        return res.json({success:false,message:error.message})
    }
}

export default authAdmin
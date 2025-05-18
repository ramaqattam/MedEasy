import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    
    if (!dtoken) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
    
    // Check if doctor exists
    const doctor = await doctorModel.findById(decoded.id);
    if (!doctor) {
      return res.status(401).json({ 
        success: false, 
        message: "Doctor not found" 
      });
    }
    
    // Add doctor to request object
    req.doctor = {
      id: doctor._id,
      email: doctor.email
    };
    
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

export { authDoctor };
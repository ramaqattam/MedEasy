import validator from "validator";
import bycrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import dctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      speciality,
      degree,
      experience,
      about,
      fees,
    } = req.body;
    const imageFile = req.file;
    console.log(
      {
        name,
        email,
        password,
        address,
        speciality,
        degree,
        experience,
        about,
        fees,
      },
      imageFile
    );
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees
    ) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageUrl = imageUpload.secure_url;

     const doctoData = {
            name,
            email,
            password: hashedPassword,
            address:JSON.parse(address),
            speciality,
            degree,
            experience,
            about,
            fees,
            Image: imageUrl,  
     }

     const newDoctor = new dctorModel(doctoData)
      await newDoctor.save();

      res.json({success:true,message:"Doctor added successfully"})

  } catch (error) {
    console.log(error);
    res.json({ success:false,message:error.message });
  }
};

//API FOR ADMIN LOGIN
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign( email+password,process.env.JWT_SECRET)
     res.status(200).json({
        success: true,
        token,
      });
    }else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
     
    

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


 









export { addDoctor, loginAdmin };

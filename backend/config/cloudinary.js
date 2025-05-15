import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
    cloudinary.config({
        CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    })
       
}

export default connectCloudinary;
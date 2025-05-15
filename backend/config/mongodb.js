import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/MedEasy`);

    console.log("Database Connected");
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
    process.exit(1); // يوقف التطبيق لأنه ما قدر يتصل بالقاعدة
  }
};

export default connectDB;

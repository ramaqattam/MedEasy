import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';  
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import userModel from './models/userModel.js'; // ✅ add this
import doctorRouter from './routes/doctorRoute.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect DB and insert dummy user
connectDB().then(() => {
  ensureUserCollection(); // 👈 run user insertion logic
});

connectCloudinary();

app.use(cors());
app.use(express.json());
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// ✅ Add dummy user if needed
async function ensureUserCollection() {
  const count = await userModel.countDocuments();
  if (count === 0) {
    await userModel.create({
      name: "Test User",
      email: "test@example.com",
      password: "test123"
    });
    console.log("✅ Dummy user created to initialize 'users' collection.");
  } else {
    console.log("✅ Users collection already exists.");
  }
}
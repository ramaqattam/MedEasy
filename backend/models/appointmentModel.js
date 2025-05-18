// models/appointmentModel.js
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'doctor', 
    required: true 
  },
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  slot: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'pending' 
  },
  symptoms: { 
    type: String, 
    default: '' 
  },
  notes: { 
    type: String, 
    default: '' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
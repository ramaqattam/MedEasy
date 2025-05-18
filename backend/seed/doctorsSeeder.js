// seed/doctorsSeeder.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import doctorModel from "../models/doctorModel.js"; 

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medeasy";

const seedDoctors = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");

    // Clear existing doctors (optional)
    await doctorModel.deleteMany();

    const doctors = [];

    for (let i = 0; i < 100; i++) {
      const doctor = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        Image: faker.image.avatar(),
        speciality: faker.person.jobType(),
        degree: faker.lorem.word() + " Degree",
        experience: `${faker.number.int({ min: 1, max: 20 })} years`,
        about: faker.lorem.paragraph(),
        available: faker.datatype.boolean(),
        fees: faker.number.int({ min: 20, max: 100 }),
        address: {
          line1: faker.location.streetAddress(),
          line2: faker.location.secondaryAddress(),
        },
        date: faker.date.recent().getTime(),
        slots_bokked: {},
      };

      doctors.push(doctor);
    }

    await doctorModel.insertMany(doctors);
    console.log("Seeded 100 doctors successfully");

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDoctors();
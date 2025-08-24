import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../db/connect";
import User from "../models/user.model";

dotenv.config();

const createSuperAdmin = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in your .env file.");
    process.exit(1);
  }

  await connectDB(MONGO_URI);

  const adminEmail = process.env.SUPER_ADMIN_EMAIL;
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error(
      "SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in your .env file"
    );
    process.exit(1);
  }

  try {
    const existingAdmin = await User.findOne({ role: "SuperAdmin" });
    if (existingAdmin) {
      console.log("Super Admin already exists.");
      return;
    }

    const superAdmin = new User({
      name: "Super Admin",
      email: adminEmail,
      password: adminPassword,
      role: "SuperAdmin",
    });

    await superAdmin.save();
    console.log("Super Admin created successfully!");
  } catch (error) {
    console.error("Error creating Super Admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

createSuperAdmin();

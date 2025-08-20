import { Request, Response } from "express";
import User from "../models/user.model";
import validator from "validator";

export const createEmployer = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, and password" });
  }

  if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
  }

  if (!validator.isLength(password, { min: 8 })) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const employer = await User.create({
      name,
      email,
      password,
      role: "Employer",
      createdBy: req.user?.userId, // Set the creator as the logged-in Super Admin
    });

    // We don't send the full employer object back, especially not the password
    res.status(201).json({
      success: true,
      user: {
        _id: employer._id,
        name: employer.name,
        email: employer.email,
        role: employer.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error creating employer", error });
  }
};

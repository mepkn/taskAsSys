import { Request, Response } from "express";
import User from "../models/user.model";
import { createJWT } from "../utils/jwt";
import validator from "validator";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Please provide a valid email address" });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = createJWT({ userId: user._id, role: user.role });

  res.status(200).json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
};

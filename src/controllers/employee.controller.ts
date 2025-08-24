import { Request, Response } from "express";
import User from "../models/user.model";

export const getAllEmployers = async (req: Request, res: Response) => {
  try {
    const employers = await User.find({ role: "Employer" }).select(
      "name email"
    );
    res.status(200).json({ success: true, employers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error retrieving employers", error });
  }
};

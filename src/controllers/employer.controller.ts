import { Request, Response } from "express";
import User from "../models/user.model";
import Task from "../models/task.model";
import validator from "validator";

export const createEmployee = async (req: Request, res: Response) => {
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

    const employee = await User.create({
      name,
      email,
      password,
      role: "Employee", // Set role to Employee
      createdBy: req.user?.userId, // Set the creator as the logged-in Employer
    });

    res.status(201).json({
      success: true,
      user: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error creating employee", error });
  }
};

export const getTaskReport = async (req: Request, res: Response) => {
    const employerId = req.user?.userId;

    try {
        const report = await Task.aggregate([
            { $match: { createdBy: employerId, isDeleted: false } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const overdueCount = await Task.countDocuments({
            createdBy: employerId,
            isDeleted: false,
            deadline: { $lt: new Date() },
            status: { $nin: ['Completed'] }
        });

        const reportData = report.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        reportData.Overdue = overdueCount;

        res.status(200).json({ success: true, report: reportData });
    } catch (error) {
        res.status(500).json({ message: "Server error generating report", error });
    }
};

import { Request, Response } from "express";
import Task from "../models/task.model";
import User from "../models/user.model";
import { sendEmail } from "../services/notification.service";
import validator from "validator";

// For Employers
export const createTask = async (req: Request, res: Response) => {
  const { title, description, deadline, assignedTo } = req.body;
  const employerId = req.user?.userId;

  if (!title || !description || !deadline || !assignedTo || !Array.isArray(assignedTo) || assignedTo.length === 0) {
    return res.status(400).json({ message: "Please provide all required fields: title, description, deadline, and at least one assigned employee." });
  }

  if (!validator.isISO8601(deadline)) {
      return res.status(400).json({ message: "Please provide a valid date for the deadline." });
  }

  try {
    const employees = await User.find({ _id: { $in: assignedTo }, createdBy: employerId, role: 'Employee' });
    if (employees.length !== assignedTo.length) {
        return res.status(400).json({ message: "Invalid employee ID(s) provided. Ensure all users are valid employees managed by you." });
    }

    const task = await Task.create({
      title,
      description,
      deadline,
      assignedTo,
      createdBy: employerId,
    });

    employees.forEach(employee => {
        sendEmail({
            to: employee.email,
            subject: "You have a new task!",
            text: `Hi ${employee.name},\n\nA new task "${task.title}" has been assigned to you. The deadline is ${task.deadline.toDateString()}.\n\nPlease log in to view the details.`,
            html: `<p>Hi ${employee.name},</p><p>A new task "<strong>${task.title}</strong>" has been assigned to you. The deadline is <strong>${task.deadline.toDateString()}</strong>.</p><p>Please log in to view the details.</p>`
        }).catch(err => console.error(`Failed to send email to ${employee.email}`, err));
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: "Server error creating task", error });
  }
};

export const getAllTasksForEmployer = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find({ createdBy: req.user?.userId, isDeleted: false }).populate('assignedTo', 'name email');
        res.status(200).json({ success: true, count: tasks.length, tasks });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching tasks", error });
    }
};

export const getTask = async (req: Request, res: Response) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, createdBy: req.user?.userId, isDeleted: false }).populate('assignedTo', 'name email');
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching task", error });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user?.userId, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ message: "Server error updating task", error });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user?.userId },
            { isDeleted: true },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error deleting task", error });
    }
};

// For Employees
export const getAllTasksForEmployee = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user?.userId, isDeleted: false }).populate('createdBy', 'name email');
        res.status(200).json({ success: true, count: tasks.length, tasks });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching tasks", error });
    }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
    const { status } = req.body;
    const { id: taskId } = req.params;

    if (!status) {
        return res.status(400).json({ message: "Please provide a status." });
    }

    try {
        const task = await Task.findOne({ _id: taskId, assignedTo: req.user?.userId, isDeleted: false });
        if (!task) {
            return res.status(404).json({ message: "Task not found or you are not authorized to update it." });
        }

        task.status = status;
        await task.save();

        if (status === 'Completed') {
            const employer = await User.findById(task.createdBy);
            if (employer) {
                sendEmail({
                    to: employer.email,
                    subject: `Task Completed: ${task.title}`,
                    text: `Hi ${employer.name},\n\nThe task "${task.title}" has been marked as completed by the assignee.\n\nPlease log in to review and approve it.`,
                    html: `<p>Hi ${employer.name},</p><p>The task "<strong>${task.title}</strong>" has been marked as completed by the assignee.</p><p>Please log in to review and approve it.</p>`
                }).catch(err => console.error(`Failed to send completion email to ${employer.email}`, err));
            }
        }

        res.status(200).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ message: "Server error updating task status", error });
    }
};

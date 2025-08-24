import { Request, Response } from "express";
import File from "../models/file.model";
import Task from "../models/task.model";
import Activity from "../models/activity.model";

export const uploadFile = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const userId = req.user?.userId;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      // Here you might want to delete the uploaded file from the server
      return res.status(404).json({ message: "Task not found" });
    }

    // Again, more complex authorization could be added here

    const newFile = await File.create({
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      taskId: taskId,
      uploadedBy: userId,
    });

    // Log the activity
    if(req.file) {
        await Activity.create({
            task: taskId,
            user: userId,
            type: 'FileUploaded',
            details: `Uploaded file: ${req.file.filename}`,
        });
    }

    res.status(201).json({ success: true, message: "File uploaded successfully", file: newFile });
  } catch (error) {
    res.status(500).json({ message: "Server error uploading file", error });
  }
};

import { Request, Response } from "express";
import Comment from "../models/comment.model";
import Task from "../models/task.model";
import Activity from "../models/activity.model";

export const createComment = async (req: Request, res: Response) => {
  const { text } = req.body;
  const { taskId } = req.params;
  const userId = req.user?.userId;

  if (!text) {
    return res.status(400).json({ message: "Comment text cannot be empty" });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // A more complex authorization check might be needed here to ensure
    // the user is allowed to comment on this task (e.g., they are the creator or an assignee)
    // For now, we'll assume if they can hit the endpoint, they are authorized.

    const comment = await Comment.create({
      text,
      taskId,
      userId,
    });

    // Log the activity
    await Activity.create({
      task: taskId,
      user: userId,
      type: 'Commented',
      details: `Added a comment.`, // Simple message for now
    });

    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ message: "Server error creating comment", error });
  }
};

export const getCommentsForTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  try {
    const comments = await Comment.find({ taskId }).populate('userId', 'name role');
    res.status(200).json({ success: true, count: comments.length, comments });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching comments", error });
  }
};

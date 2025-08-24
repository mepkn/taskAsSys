import { Request, Response } from 'express';
import Activity from '../models/activity.model';
import Task from '../models/task.model';

export const getActivitiesForTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const userId = req.user?.userId;

  try {
    // First, verify the user has access to the task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the user is either the creator of the task or assigned to it
    const isCreator = task.createdBy.toString() === userId;
    const isAssignee = task.assignedTo.some(assigneeId => assigneeId.toString() === userId);

    if (!isCreator && !isAssignee) {
      return res.status(403).json({ message: 'You are not authorized to view activities for this task' });
    }

    const activities = await Activity.find({ task: taskId })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .populate('user', 'name role'); // Populate user's name and role

    res.status(200).json({ success: true, count: activities.length, activities });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching activities', error });
  }
};

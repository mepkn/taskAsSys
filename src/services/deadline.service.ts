import Task from '../models/task.model';
import { sendEmail } from './notification.service';
import { connectDB } from '../db/connect';
import mongoose from 'mongoose';

export const checkDeadlinesAndSendReminders = async () => {
  console.log('Checking for upcoming task deadlines...');

  // Define the time window for reminders (e.g., within the next 24 hours)
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    const upcomingTasks = await Task.find({
      deadline: { $gte: now, $lte: tomorrow },
      status: { $nin: ['Completed'] },
      isDeleted: false,
      deadlineReminderSent: false,
    }).populate('assignedTo', 'name email');

    if (upcomingTasks.length === 0) {
      console.log('No upcoming tasks found for reminder.');
      return;
    }

    console.log(`Found ${upcomingTasks.length} upcoming tasks. Sending reminders...`);

    for (const task of upcomingTasks) {
      for (const user of task.assignedTo as any) { // Type assertion to access populated fields
        if (user && user.email) {
          console.log(`Sending reminder for task "${task.title}" to ${user.email}`);
          await sendEmail({
            to: user.email,
            subject: `Reminder: Task "${task.title}" is due soon`,
            text: `Hi ${user.name},\n\nThis is a reminder that the task "${task.title}" is due on ${task.deadline.toDateString()}.\n\nPlease complete it on time.`,
            html: `<p>Hi ${user.name},</p><p>This is a reminder that the task "<strong>${task.title}</strong>" is due on <strong>${task.deadline.toDateString()}</strong>.</p><p>Please complete it on time.</p>`,
          });
        }
      }

      // Mark the task as reminder sent
      task.deadlineReminderSent = true;
      await task.save();
    }

    console.log('Finished sending deadline reminders.');

  } catch (error) {
    console.error('Error sending deadline reminders:', error);
  }
};

// This allows running the script directly
if (require.main === module) {
  require('dotenv').config(); // Load environment variables

  const run = async () => {
    await connectDB(process.env.MONGO_URI!);
    await checkDeadlinesAndSendReminders();
    await mongoose.disconnect();
  };

  run().catch(err => {
    console.error('Failed to run deadline checker:', err);
    process.exit(1);
  });
}

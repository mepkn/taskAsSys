import { Schema, model, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  deadline: Date;
  status: "To Do" | "In Progress" | "Completed" | "Overdue" | "Pending Review";
  assignedTo: Schema.Types.ObjectId[];
  createdBy: Schema.Types.ObjectId;
  isDeleted: boolean;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    deadline: {
      type: Date,
      required: [true, "Please set a deadline for the task"],
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Completed", "Overdue", "Pending Review"],
      default: "To Do",
    },
    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deadlineReminderSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps:true }
);

const Task = model<ITask>("Task", taskSchema);

export default Task;

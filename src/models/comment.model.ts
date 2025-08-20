import { Schema, model, Document } from "mongoose";

export interface IComment extends Document {
  text: string;
  taskId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
  {
    text: {
      type: String,
      required: [true, "Comment text cannot be empty"],
      trim: true,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;

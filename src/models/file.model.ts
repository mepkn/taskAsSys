import { Schema, model, Document } from "mongoose";

export interface IFile extends Document {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  taskId: Schema.Types.ObjectId;
  uploadedBy: Schema.Types.ObjectId;
}

const fileSchema = new Schema<IFile>(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const File = model<IFile>("File", fileSchema);

export default File;

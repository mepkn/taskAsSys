import { Schema, model, Document, Types } from 'mongoose';

export interface IActivity extends Document {
  task: Types.ObjectId;
  user: Types.ObjectId;
  type: 'Created' | 'StatusChanged' | 'Commented' | 'FileUploaded';
  details: string;
  createdAt: Date;
}

const ActivitySchema = new Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Created', 'StatusChanged', 'Commented', 'FileUploaded'],
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
}, { timestamps: { createdAt: true, updatedAt: false } });

const Activity = model<IActivity>('Activity', ActivitySchema);

export default Activity;

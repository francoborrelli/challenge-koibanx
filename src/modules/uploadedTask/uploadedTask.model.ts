import mongoose from 'mongoose';
import type { IUploadTaskDoc } from './uploadedTask.interfaces';

const uploadTaskSchema = new mongoose.Schema<IUploadTaskDoc>(
  {
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'processing', 'done'],
    },
    filename: {
      type: String,
      required: true,
    },
    filepath: {
      type: String,
      required: true,
    },
    uploaded_by: {
      type: String,
      ref: 'User',
      required: false,
    },
    data: [
      {
        type: Map,
        of: new mongoose.Schema({
          key: { type: String, required: true },
          value: { type: mongoose.Schema.Types.Mixed, required: true },
        }),
      },
    ],
    errors_data: [
      {
        row: { type: Number, required: true },
        column: { type: String, required: true },
        message: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

uploadTaskSchema.methods.getInitial = function () {
  return {
    _id: this._id,
    status: this.status,
    createdAt: this.createdAt,
  };
};

const UploadTask = mongoose.model<IUploadTaskDoc & mongoose.Document>('UploadTask', uploadTaskSchema);

export default UploadTask;

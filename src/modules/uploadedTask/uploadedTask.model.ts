import mongoose from 'mongoose';

// Interfaces
import type { IUploadTaskDoc, IUploadTaskDataDoc, IUploadTaskErrorDoc } from './uploadedTask.interfaces';

/*************************************************
 *
 *            UPLOAD TASK SCHEMA
 *
 ************************************************/

/**
 * Schema definition for the UploadTask model.
 *
 * @typedef {Object} IUploadTaskDoc
 * @property {string} status - The current status of the upload task. Default is 'pending'. Possible values are 'pending', 'processing', and 'done'.
 * @property {string} filename - The name of the uploaded file. This field is required.
 * @property {string} filepath - The path where the file is stored. This field is required.
 * @property {string} [uploaded_by] - The user who uploaded the file. This field is optional and references the 'User' model.
 * @property {number} formatter - The formatter identifier. This field is required.
 *
 * @property {Date} createdAt - The date when the upload task was created. This field is automatically managed by Mongoose.
 * @property {Date} updatedAt - The date when the upload task was last updated. This field is automatically managed by Mongoose.
 */
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
    formatter: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

uploadTaskSchema.methods.getInitial = function () {
  return {
    _id: this._id,
    status: this.status,
    formatter: this.formatter,
    createdAt: this.createdAt,
  };
};

uploadTaskSchema.index({ status: 1 });

const UploadTask = mongoose.model<IUploadTaskDoc & mongoose.Document>('UploadTask', uploadTaskSchema);

/*************************************************
 *
 *            UPLOAD TASK DATA SCHEMA
 *
 ************************************************/

const uploadTaskDataSchema = new mongoose.Schema({
  uploadTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadTask',
    required: true,
  },
  data: {
    type: Map,
    required: true,
    of: mongoose.Schema.Types.Mixed,
  },
});

const UploadTaskData = mongoose.model<IUploadTaskDataDoc & mongoose.Document>('UploadTaskData', uploadTaskDataSchema);
uploadTaskDataSchema.index({ uploadTask: 1 });

/*************************************************
 *
 *            UPLOAD TASK ERROR SCHEMA
 *
 ************************************************/

const uploadTaskErrorSchema = new mongoose.Schema({
  uploadTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadTask',
    required: true,
  },
  row: {
    type: Number,
    required: true,
  },
  column: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: false,
  },
});

const UploadTaskError = mongoose.model<IUploadTaskErrorDoc & mongoose.Document>(
  'UploadTaskError',
  uploadTaskErrorSchema
);

uploadTaskErrorSchema.index({ uploadTask: 1, row: 1, column: 1 });

export { UploadTaskData, UploadTaskError };
export default UploadTask;

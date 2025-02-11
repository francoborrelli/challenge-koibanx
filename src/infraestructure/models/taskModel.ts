import mongoose, { Model } from 'mongoose';

import paginate from './utils/paginate';

import type { IUploadTask } from '../../domain/entities/task';
import type { IOptions, QueryResult } from './utils/paginate/paginate.types';

/*************************************************
 *
 *            UPLOAD TASK SCHEMA
 *
 ************************************************/

export interface IUploadTaskModel extends Model<IUploadTask> {
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult>;
}

/**
 * Schema definition for the UploadTask model.
 *
 * @typedef {Object} IUploadTask
 * @property {string} status - The current status of the upload task. Default is 'pending'. Possible values are 'pending', 'processing', and 'done'.
 * @property {string} filename - The name of the uploaded file. This field is required.
 * @property {string} filepath - The path where the file is stored. This field is required.
 * @property {string} [uploaded_by] - The user who uploaded the file. This field is optional and references the 'User' model.
 * @property {number} formatter - The formatter identifier. This field is required.
 *
 * @property {Date} createdAt - The date when the upload task was created. This field is automatically managed by Mongoose.
 * @property {Date} updatedAt - The date when the upload task was last updated. This field is automatically managed by Mongoose.
 */
const uploadTaskSchema = new mongoose.Schema<IUploadTask, IUploadTaskModel>(
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
      type: mongoose.Schema.Types.ObjectId,
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

// @ts-ignore
uploadTaskSchema.plugin(paginate);
uploadTaskSchema.index({ status: 1 });

export const TaskModel = mongoose.model<IUploadTask, IUploadTaskModel>('UploadTask', uploadTaskSchema);

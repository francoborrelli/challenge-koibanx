import mongoose, { Model } from 'mongoose';
import paginate from './utils/paginate';

import type { IUploadTaskError } from '../../domain/entities/task';
import type { IOptions, QueryResult } from './utils/paginate/paginate.types';

/*************************************************
 *
 *            UPLOAD TASK ERROR RELATED
 *
 ************************************************/

export interface IUploadTaskErrorModel extends Model<IUploadTaskError> {
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult>;
}

const uploadTaskErrorSchema = new mongoose.Schema<IUploadTaskError, IUploadTaskErrorModel>({
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

// @ts-ignore
uploadTaskErrorSchema.plugin(paginate);
uploadTaskErrorSchema.index({ uploadTask: 1, row: 1, column: 1 });

export const UploadTaskError = mongoose.model<IUploadTaskError, IUploadTaskErrorModel>(
  'UploadTaskError',
  uploadTaskErrorSchema
);

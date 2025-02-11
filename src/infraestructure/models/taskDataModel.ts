import mongoose, { Model } from 'mongoose';

// Utils
import paginate from './utils/paginate';

// Interfaces
import type { IUploadTaskData } from '../../domain/entities/task';
import type { IOptions, QueryResult } from './utils/paginate/paginate.types';

export interface IUploadTaskDataModel extends Model<IUploadTaskData> {
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult>;
}

const uploadTaskDataSchema = new mongoose.Schema<IUploadTaskData, IUploadTaskDataModel>({
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

// @ts-ignore
uploadTaskDataSchema.plugin(paginate);
uploadTaskDataSchema.index({ uploadTask: 1 });

export const UploadTaskData = mongoose.model<IUploadTaskData, IUploadTaskDataModel>(
  'UploadTaskData',
  uploadTaskDataSchema
);

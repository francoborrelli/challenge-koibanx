import mongoose from 'mongoose';

import type { Document, Model } from 'mongoose';
import type { IOptions, QueryResult } from '../paginate/paginate';

/*************************************************
 *
 *            UPLOAD TASK RELATED
 *
 ************************************************/

export enum AvailableMappingsTypes {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  'Array<String>' = 'array<string>',
  'Array<Number>' = 'array<number>',
  'Array<Boolean>' = 'array<boolean>',
}

export type MappingTypes = keyof typeof AvailableMappingsTypes;

export const MappingsArray = Object.keys(AvailableMappingsTypes) as MappingTypes[];

export type UploadStatus = 'pending' | 'processing' | 'done';

export interface IUploadTaskDoc extends Document {
  createdAt: Date;
  updatedAt: Date;
  filename: string;
  filepath: string;
  formatter: number;
  status: UploadStatus;
  uploaded_by: mongoose.Schema.Types.ObjectId;
  getInitial(): { _id: string; status: string; createdAt: Date; mappings: Record<string, MappingTypes> };
}

export interface IUploadTaskModel extends Model<IUploadTaskDoc> {
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult>;
}

export type NewIUploadTaskDocData = Pick<IUploadTaskDoc, 'filename' | 'filepath' | 'formatter' | 'uploaded_by'>;

/*************************************************
 *
 *            UPLOAD TASK DATA RELATED
 *
 ************************************************/

export interface IUploadTaskDataDoc extends Document {
  uploadTask: mongoose.Schema.Types.ObjectId;
  data: Record<string, any>;
}

export interface IUploadTaskDataModel extends Model<IUploadTaskDataDoc> {
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult>;
}

export type NewIUploadTaskDataItem = IUploadTaskDataDoc['data'];

/*************************************************
 *
 *            UPLOAD TASK ERROR RELATED
 *
 ************************************************/

export interface IUploadTaskErrorDoc extends Document {
  uploadTask: mongoose.Schema.Types.ObjectId;
  row: number;
  column: number;
  message?: string;
}

export interface IUploadTaskErrorModel extends Model<IUploadTaskErrorDoc> {
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult>;
}

export type NewIUploadTaskError = Pick<IUploadTaskErrorDoc, 'row' | 'column' | 'message'>;

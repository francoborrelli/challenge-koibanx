import type { Document } from 'mongoose';

/*************************************************
 *
 *            UPLOAD TASK RELATED
 *
 ************************************************/

enum AvailableMappingsTypes {
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
  uploaded_by: string;
  status: UploadStatus;
  getInitial(): { _id: string; status: string; createdAt: Date; mappings: Record<string, MappingTypes> };
}

export type NewIUploadTaskDocData = Pick<IUploadTaskDoc, 'filename' | 'filepath' | 'formatter'>;

/*************************************************
 *
 *            UPLOAD TASK DATA RELATED
 *
 ************************************************/

export interface IUploadTaskDataDoc extends Document {
  uploadTask: string;
  data: Record<string, any>;
}

export type NewIUploadTaskDataItem = IUploadTaskDataDoc['data'];

/*************************************************
 *
 *            UPLOAD TASK ERROR RELATED
 *
 ************************************************/

export interface IUploadTaskErrorDoc extends Document {
  uploadTask: string;
  row: number;
  column: number;
  message?: string;
}

export type NewIUploadTaskError = Pick<IUploadTaskErrorDoc, 'row' | 'column' | 'message'>;

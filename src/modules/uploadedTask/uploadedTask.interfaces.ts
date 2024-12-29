import type { Document } from 'mongoose';

export interface IUploadTaskDoc extends Document {
  createdAt: Date;
  updatedAt: Date;
  filename: string;
  filepath: string;
  uploaded_by: string;
  data?: Map<string, any>[];
  status: 'pending' | 'processing' | 'done';
  errors_data?: { row: number; column: string; message: string }[];
  getInitial(): { _id: string; status: string; createdAt: Date };
}

export type NewIUploadTaskDocData = Pick<IUploadTaskDoc, 'filename' | 'filepath'>;

export type UploadStatus = 'pending' | 'processing' | 'done';

export class IUploadTask {
  _id: any;
  createdAt: Date;
  updatedAt: Date;
  filename: string;
  filepath: string;
  formatter: number;
  status: UploadStatus;
  uploaded_by: any;

  constructor(
    _id: any,
    createdAt: Date,
    updatedAt: Date,
    filename: string,
    filepath: string,
    formatter: number,
    status: UploadStatus,
    uploaded_by: any
  ) {
    this._id = _id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.filename = filename;
    this.filepath = filepath;
    this.formatter = formatter;
    this.status = status;
    this.uploaded_by = uploaded_by;
  }

  getInitial() {
    return {
      _id: this._id,
      status: this.status,
      formatter: this.formatter,
      createdAt: this.createdAt,
    };
  }
}

export type NewIUploadTaskDocData = Pick<IUploadTask, 'filename' | 'filepath' | 'formatter' | 'uploaded_by'>;

export class IUploadTaskData {
  _id: any;
  createdAt: Date;
  updatedAt: Date;
  uploadTask: any;
  data: Record<any, any>;

  constructor(_id: string, createdAt: Date, updatedAt: Date, uploadTask: string, data: any) {
    this._id = _id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.uploadTask = uploadTask;
    this.data = data;
  }
}

export type NewIUploadTaskDataItem = IUploadTaskData['data'];

export class IUploadTaskError {
  _id: any;
  createdAt: Date;
  updatedAt: Date;
  uploadTask: any;
  row: number;
  column: number;
  message: string;

  constructor(
    _id: any,
    createdAt: Date,
    updatedAt: Date,
    uploadTask: any,
    row: number,
    column: number,
    message: string
  ) {
    this._id = _id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.uploadTask = uploadTask;
    this.row = row;
    this.column = column;
    this.message = message;
  }
}

export type NewIUploadTaskError = Pick<IUploadTaskError, 'row' | 'column' | 'message'>;

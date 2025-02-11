import type {
  IUploadTask as ITask,
  IUploadTaskData,
  IUploadTaskError,
  NewIUploadTaskDataItem,
  NewIUploadTaskDocData,
} from '../entities/task';

export interface ITaskRepository {
  findAll(): Promise<ITask[]>;
  findById(id: string): Promise<ITask | null>;
  create(task: NewIUploadTaskDocData): Promise<ITask>;
  update(task: ITask): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ITaskDataRepository {
  create(taskId: any, items: NewIUploadTaskDataItem[]): Promise<IUploadTaskData[] | null>;
  getTaskData(taskId: any, options: Record<any, any>): Promise<Record<any, any>[]>;
}

export interface ITaskErrorRepository {
  create(taskId: any, items: any[]): Promise<IUploadTaskError[] | null>;
  getTaskErrors(taskId: any, options: Record<any, any>): Promise<Record<any, any>[]>;
}

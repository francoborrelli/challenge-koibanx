import type { IUploadTask } from '../entities/task';

export interface ITaskQueueRepository {
  getQueue(): any;
  getWorker(): any;
  disconnect(): Promise<void>;
  addToQueue(task: IUploadTask): Promise<any>;
}

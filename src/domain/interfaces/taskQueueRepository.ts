import type { IUploadTask } from '../entities/task';

export interface ITaskQueueRepository {
  getQueue(): any;
  getWorker(): any;
  addToQueue(task: IUploadTask): Promise<any>;
}

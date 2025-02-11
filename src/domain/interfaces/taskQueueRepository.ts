import type { IUploadTask } from '../entities/task';

export interface ITaskQueueRepository {
  getQueue(): any;
  getWorker(): any;
  processTask(taskId: string): Promise<void>;
  addToQueue(task: IUploadTask): Promise<any>;
}

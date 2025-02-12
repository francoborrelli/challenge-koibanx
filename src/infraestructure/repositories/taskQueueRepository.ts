import { Processor, Queue, WorkerOptions, Worker } from 'bullmq';
import type { ITaskQueueRepository } from '../../domain/interfaces/taskQueueRepository';

import config from '../../config';
import { ExcelProcessorService } from '../excel';

type RedisConfiguration = WorkerOptions['connection'];

const WORKER_CONFIG: Partial<WorkerOptions> = {
  concurrency: 1,
  autorun: false,
  removeOnComplete: {
    age: 1000 * 60 * 60 * 24, // 24 hours
    count: 1000,
  },
  removeOnFail: { count: 5000 },
};

class BullmqTaskQueueRepository implements ITaskQueueRepository {
  private _queue_name = 'uploadedTaskQueue';

  private _queue: Queue;
  private _worker: Worker;

  private _excelProcessor: ExcelProcessorService;

  constructor(excelProcessor: ExcelProcessorService, redisConfig: RedisConfiguration = { url: config.redis.url }) {
    this._excelProcessor = excelProcessor;
    this._queue = this.initializeQueue(redisConfig);
    this._worker = this.initializeWorker(redisConfig);
  }

  getQueue(): Queue {
    return this._queue;
  }

  getWorker(): Worker {
    return this._worker;
  }

  async addToQueue(task: any) {
    return await this._queue.add(`task upload`, { jobData: { id: task.id } });
  }

  private initializeQueue(redisConfig: RedisConfiguration) {
    return new Queue(this._queue_name, { connection: redisConfig });
  }

  private initializeWorker(redisConfig: RedisConfiguration) {
    const workerLogic: Processor<{ jobData: { id: string } }, any, string> = async (job) => {
      console.log(`Processing job ${job.id} of type ${job.name}`);
      const { jobData } = job.data;
      const { id: taskId } = jobData;
      await this._excelProcessor.processTask(taskId);
    };
    const worker = new Worker(this._queue_name, workerLogic, { ...WORKER_CONFIG, connection: redisConfig });
    worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed successfully`);
    });
    worker.on('failed', (job, err) => {
      console.log(`Job ${job?.id} failed with error: ${err.message}`);
    });
    return worker;
  }
}

export { BullmqTaskQueueRepository };

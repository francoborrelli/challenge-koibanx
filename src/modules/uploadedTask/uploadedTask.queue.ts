import { Processor, Queue, Worker, WorkerOptions } from 'bullmq';

// Config
import config from '../../config/config';

// Services
import { processTask } from './uploadedTask.utils';

const redisConfig = {
  url: config.redis.url,
} as const;

const QUEUE_NAME = 'uploadedTaskQueue';

// Define the queue
const uploadedTaskQueue = new Queue(QUEUE_NAME, {
  connection: redisConfig,
});

const WORKER_CONFIG: WorkerOptions = {
  concurrency: 1,
  autorun: false,
  connection: redisConfig,
  removeOnComplete: {
    age: 1000 * 60 * 60 * 24, // 24 hours
    count: 1000,
  },
  removeOnFail: { count: 5000 },
};

// Define the worker
function createUploadedTaskWorker() {
  const workerLogic: Processor<{ jobData: { id: string } }, any, string> = async (job) => {
    console.log(`Processing job ${job.id} of type ${job.name}`);
    const { jobData } = job.data;
    const { id: taskId } = jobData;
    await processTask(taskId);
  };

  const worker = new Worker(QUEUE_NAME, workerLogic, WORKER_CONFIG);

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} failed with error: ${err.message}`);
  });

  return worker;
}

export { uploadedTaskQueue, createUploadedTaskWorker };

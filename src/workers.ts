import mongoose from 'mongoose';
import config from './config/config';
import { logger } from './modules/logger';

import { createUploadedTaskWorker } from './modules/uploadedTask/uploadedTask.queue';

const workersCreators = [createUploadedTaskWorker];

const workers = workersCreators.map((createWorker) => createWorker());

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoose.url, {}); // Conexión a MongoDB
    logger.info('MongoDB connected successfully');
    workers.forEach((worker) => worker.run().then(() => console.log(`Worker ${worker.name} started`)));
  } catch (error) {
    logger.error('Connection error: ', error);
    process.exit(1); // Termina el proceso si la conexión falla
  }
};

startServer();

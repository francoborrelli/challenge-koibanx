import mongoose from 'mongoose';

import config from '../config';
import { logger } from '../infraestructure/logger';
import { DIQueueContainer } from 'src/infraestructure/DIQueueContainer';

const queueRepository = DIQueueContainer.getQueueRepository();

const workers = [queueRepository.getWorker()];

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

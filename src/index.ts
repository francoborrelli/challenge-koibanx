import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './modules/logger/logger';

let server: any;

console.log('config.dsdfsdfsdfsdf.url', config.mongoose.url);

mongoose
  .connect(config.mongoose.url)
  .then(() => {
    logger.info('Connected to MongoDB');
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  })
  .catch((err) => {
    logger.error(err);
  })
  .finally(() => {
    logger.info('MongoDB connection closed');
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

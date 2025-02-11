import app from './app';

// Mongoose
import mongoose from 'mongoose';

// Config
import config from './config';
import { logger } from './infraestructure/logger';

// Utils

let server: any;

/**
 * Asynchronously starts the server.
 *
 * This function attempts to connect to a MongoDB database using the connection URL
 * specified in the configuration. If the connection is successful, it starts the server
 * and listens on the port specified in the configuration. If the connection fails, it logs
 * the error and terminates the process.
 *
 * @async
 * @function startServer
 * @returns {Promise<void>} A promise that resolves when the server has started successfully.
 * @throws Will terminate the process if the MongoDB connection fails.
 */
const startServer = async () => {
  try {
    await mongoose.connect(config.mongoose.url, {}); // Conexión a MongoDB
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('Connection error: ', error);
    process.exit(1); // Termina el proceso si la conexión falla
  }

  // Inicia el servidor si la conexión a la base de datos es exitosa
  server = app.listen(config.port, () => {
    logger.info(`Listening on port ${config.port}`);
  });
};

/**
 * Handles the process exit by closing the server and disconnecting from MongoDB.
 *
 * This function ensures that the server is properly closed and the MongoDB connection
 * is disconnected before the process exits. If the server is running, it will close
 * the server and log the closure. If the server is not running, it will simply exit
 * the process.
 *
 * @async
 * @function exitHandler
 * @returns {Promise<void>} A promise that resolves when the server is closed and MongoDB is disconnected.
 */
const exitHandler = async () => {
  if (server) {
    server.close(() => {
      mongoose.disconnect(); // Desconectar MongoDB al cerrar el servidor
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1); // Si no hay servidor, finaliza el proceso
  }
};

const unexpectedErrorHandler = (error: any) => {
  logger.error(`Unexpected error: ${error}`);
  exitHandler();
};

// Maneja excepciones no capturadas
process.on('uncaughtException', (error) => unexpectedErrorHandler(error));
process.on('unhandledeRejection', (error) => unexpectedErrorHandler(error));

// Manejo de señales de terminación (SIGTERM, SIGINT)
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  exitHandler();
});

process.on('SIGINT', () => {
  logger.info('SIGINT received');
  exitHandler();
});

// Inicia el servidor
startServer();

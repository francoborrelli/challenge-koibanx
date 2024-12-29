import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './modules/logger/logger';

let server: any;

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

const exitHandler = async () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      mongoose.disconnect(); // Desconectar MongoDB al cerrar el servidor
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

import mongoose from 'mongoose';

// Config
import config from '../config/config';

// Jest
import { beforeAll, beforeEach, afterAll } from '@jest/globals';
import { uploadedTaskQueue } from '../modules/uploadedTask/uploadedTask.queue';

/**
 * Sets up the test database for use in Jest tests.
 *
 * This function performs the following actions:
 * - Before all tests run, it connects to the MongoDB database using the URL specified in the configuration.
 * - Before each test runs, it clears all collections in the database to ensure a clean state for each test.
 * - After all tests have run, it disconnects from the MongoDB database.
 *
 * Usage:
 * Call this function at the beginning of your test suite to ensure the database is properly set up and torn down for each test.
 */
const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(config.mongoose.url);
  });

  beforeEach(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany({}))
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await uploadedTaskQueue.disconnect();
  });
};

export default setupTestDB;

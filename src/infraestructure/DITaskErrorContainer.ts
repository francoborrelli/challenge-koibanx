import { MongoTasksErrorRepository } from './repositories/taskErrorRepository';

// User cases
import { GetTaskError } from '../use-cases/task-error/getTaskError';

class DITaskErrorContainer {
  private static _tasksErrorRepository = new MongoTasksErrorRepository();

  static getTasksDataRepository() {
    return this._tasksErrorRepository;
  }

  static getTaskErrorUseCase() {
    return new GetTaskError(this._tasksErrorRepository);
  }
}

export { DITaskErrorContainer };

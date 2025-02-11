import { MongoTasksDataRepository } from './repositories/taskDataRepository';

// User cases
import { GetTaskData } from '../use-cases/task-data/getTaskData';

class DITaskDataContainer {
  private static _tasksDataRepository = new MongoTasksDataRepository();

  static getTasksDataRepository() {
    return this._tasksDataRepository;
  }

  static getTaskDataUseCase() {
    return new GetTaskData(this._tasksDataRepository);
  }
}

export { DITaskDataContainer };

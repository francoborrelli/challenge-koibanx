import { MongoTasksRepository } from './repositories/tasksRepository';
import { BullmqTaskQueueRepository } from './repositories/taskQueueRepository';

// User cases
import { CreateTask } from '../use-cases/tasks/createTask';
import { GetTaskStatus } from '../use-cases/tasks/getTaskStatus';
import { GetTaskFormatters } from '../use-cases/tasks/getFormatters';

class DITaskContainer {
  private static _tasksRepository = new MongoTasksRepository();
  private static _tasksQueueRepository = new BullmqTaskQueueRepository();

  static getTasksRepository() {
    return this._tasksRepository;
  }

  static getFormattersUseCase() {
    return new GetTaskFormatters();
  }

  static getCreateTaskUseCase() {
    return new CreateTask(this._tasksRepository, this._tasksQueueRepository);
  }

  static getTaskStatusUseCase() {
    return new GetTaskStatus(this._tasksRepository);
  }
}

export { DITaskContainer };

import { ExcelProcessorService } from './excel';
import { MongoTasksRepository } from './repositories/tasksRepository';
import { MongoTasksDataRepository } from './repositories/taskDataRepository';
import { MongoTasksErrorRepository } from './repositories/taskErrorRepository';
import { BullmqTaskQueueRepository } from './repositories/taskQueueRepository';

class DIQueueContainer {
  private static _tasksRepository = new MongoTasksRepository();
  private static _tasksDataRepository = new MongoTasksDataRepository();
  private static _tasksErrorRepository = new MongoTasksErrorRepository();

  private static _excelProcessorService = new ExcelProcessorService(
    this._tasksRepository,
    this._tasksDataRepository,
    this._tasksErrorRepository
  );

  private static _tasksQueueRepository = new BullmqTaskQueueRepository(this._excelProcessorService);

  static getQueueRepository() {
    return this._tasksQueueRepository;
  }
}

export { DIQueueContainer };

import type { NewIUploadTaskDocData } from '../../domain/entities/task';
import type { ITaskRepository } from '../../domain/interfaces/taskRepository';
import type { ITaskQueueRepository } from '../../domain/interfaces/taskQueueRepository';

export class CreateTask {
  constructor(
    private taskRepository: ITaskRepository,
    private taskQueueRepository: ITaskQueueRepository
  ) {}

  async execute(data: NewIUploadTaskDocData) {
    const task = await this.taskRepository.create(data);
    await this.taskQueueRepository.addToQueue(task);
    return task;
  }
}

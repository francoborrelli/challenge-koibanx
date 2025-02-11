import type { ITaskDataRepository } from '../../domain/interfaces/taskRepository';

export class GetTaskData {
  constructor(private taskDataRepository: ITaskDataRepository) {}

  async execute(id: string, options: Record<any, any>) {
    return await this.taskDataRepository.getTaskData(id, options);
  }
}

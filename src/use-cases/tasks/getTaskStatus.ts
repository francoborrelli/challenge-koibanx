import type { ITaskRepository } from '../../domain/interfaces/taskRepository';

export class GetTaskStatus {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { status: task.status };
  }
}

import type { ITaskErrorRepository } from '../../domain/interfaces/taskRepository';

export class GetTaskError {
  constructor(private taskErrorRepository: ITaskErrorRepository) {}

  async execute(id: string, options: Record<any, any>) {
    return await this.taskErrorRepository.getTaskErrors(id, options);
  }
}

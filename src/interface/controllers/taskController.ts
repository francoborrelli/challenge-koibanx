import httpStatus from 'http-status';

import { Request, Response } from 'express';

// Interfaces
import { DITaskContainer } from 'src/infraestructure/DITaskContainer';
import { DITaskDataContainer } from 'src/infraestructure/DITaskDataContainer';

export class TaskController {
  private _createTask = DITaskContainer.getCreateTaskUseCase();
  private _getTaskStatus = DITaskContainer.getTaskStatusUseCase();
  private _getTaskFormatters = DITaskContainer.getFormattersUseCase();

  private _getTaskData = DITaskDataContainer.getTaskDataUseCase();

  async createTask(req: Request, res: Response) {
    const { task } = req.body;
    const taskCreated = await this._createTask.execute(task);
    res.status(httpStatus.CREATED).send(taskCreated);
  }

  async getTaskStatus(req: Request, res: Response) {
    const { taskId } = req.params;
    const taskStatus = await this._getTaskStatus.execute(taskId);
    res.send(taskStatus);
  }

  async getTaskFormatters(req: Request, res: Response) {
    const formatters = await this._getTaskFormatters.execute();
    res.send(formatters);
  }

  async getTaskData(req: Request, res: Response) {
    const { taskId } = req.params;
    const taskData = await this._getTaskData.execute(taskId, req.query);
    res.send(taskData);
  }
}

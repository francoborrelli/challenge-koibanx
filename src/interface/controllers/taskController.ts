import httpStatus from 'http-status';

import { Request, Response } from 'express';

// Interfaces
import { DITaskContainer } from '../../infraestructure/DITaskContainer';
import { DITaskDataContainer } from '../../infraestructure/DITaskDataContainer';
import { DITaskErrorContainer } from '../../infraestructure/DITaskErrorContainer';

export class TaskController {
  private _createTask = DITaskContainer.getCreateTaskUseCase();
  private _getTaskStatus = DITaskContainer.getTaskStatusUseCase();
  private _getTaskFormatters = DITaskContainer.getFormattersUseCase();

  private _getTaskData = DITaskDataContainer.getTaskDataUseCase();
  private _getTaskErrors = DITaskErrorContainer.getTaskErrorUseCase();
  createTask = async (req: Request, res: Response) => {
    const { task } = req.body;
    const taskCreated = await this._createTask.execute(task);
    res.status(httpStatus.CREATED).send(taskCreated);
  };

  getTaskStatus = async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const taskStatus = await this._getTaskStatus.execute(taskId);
    res.send(taskStatus);
  };

  getTaskFormatters = async (req: Request, res: Response) => {
    const formatters = await this._getTaskFormatters.execute();
    res.send(formatters);
  };

  getTaskData = async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const taskData = await this._getTaskData.execute(taskId, req.query);
    res.send(taskData);
  };

  getTaskErrors = async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const taskErrors = await this._getTaskErrors.execute(taskId, req.query);
    res.send(taskErrors);
  };
}

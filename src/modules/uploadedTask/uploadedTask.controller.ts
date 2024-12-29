import { catchAsync } from 'src/utils';
import * as taskService from './uploadedTask.service';

import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { ApiError } from '../errors';
import mongoose from 'mongoose';

export const createTask = catchAsync(async (req: Request, res: Response) => {
  const { file } = req;
  if (!file) return res.status(httpStatus.BAD_REQUEST).send('No file uploaded');
  const { filename, path: filepath } = file;
  const task = await taskService.createTask({ filename, filepath });
  res.status(httpStatus.CREATED).send(task.getInitial());
});

export const getTaskStatus = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['taskId'] === 'string') {
    const taskStatus = await taskService.getTaskStatusById(new mongoose.Types.ObjectId(req.params['taskId']));
    if (!taskStatus) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
    }
    res.send(taskStatus);
  }
});

export const getTaskErrors = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['taskId'] === 'string') {
    const taskErrors = await taskService.getTaskErrorsById(new mongoose.Types.ObjectId(req.params['taskId']));
    if (!taskErrors) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
    }
    res.send(taskErrors);
  }
});

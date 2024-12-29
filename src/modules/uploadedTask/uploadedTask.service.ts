import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { IUploadTaskDoc, NewIUploadTaskDocData } from './uploadedTask.interfaces';
import UploadTask from './uploadedTask.model';
import { ApiError } from '../errors';

/**
 * Create a task
 * @returns {Promise<IUploadTaskDoc>}
 */
export const createTask = async (data: NewIUploadTaskDocData): Promise<IUploadTaskDoc> => {
  return UploadTask.create(data);
};

/**
 * Mark task as done success
 * @param {mongoose.Types.ObjectId} taskId
 * @returns {Promise<ITaskDoc | null>}
 */
export const markTaskDoneSuccess = async (
  taskId: mongoose.Types.ObjectId,
  data: Record<string, any>[]
): Promise<IUploadTaskDoc | null> => {
  const task = await UploadTask.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  task.status = 'done';
  task.data = data.map((record) => new Map(Object.entries(record)));
  await task.save();
  return task;
};

/**
 * Mark task as done error
 * @param {mongoose.Types.ObjectId} taskId
 * @returns {Promise<ITaskDoc | null>}
 */
export const markTaskDoneError = async (taskId: mongoose.Types.ObjectId): Promise<IUploadTaskDoc | null> => {
  const task = await UploadTask.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  task.status = 'done';
  await task.save();
  return task;
};

/**
 * Get task status by ID
 * @param {mongoose.Types.ObjectId} taskId
 * @returns {Promise<string>}
 */
export const getTaskStatusById = async (taskId: mongoose.Types.ObjectId): Promise<string> => {
  const task = await UploadTask.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  return task.status;
};

/**
 * Get task errors by ID
 * @param {mongoose.Types.ObjectId} taskId
 * @returns {Promise<any[]>}
 */
export const getTaskErrorsById = async (taskId: mongoose.Types.ObjectId): Promise<any[]> => {
  const task = await UploadTask.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  return task.errors_data || [];
};

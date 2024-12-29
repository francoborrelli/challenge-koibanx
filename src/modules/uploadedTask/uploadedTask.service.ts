// Utils
import httpStatus from 'http-status';

// Models
import mongoose from 'mongoose';
import UploadTask, { UploadTaskData, UploadTaskError } from './uploadedTask.model';

// Interfaces
import { ApiError } from '../errors';
import type { IUploadTaskErrorDoc, NewIUploadTaskError } from './uploadedTask.interfaces';
import type { IUploadTaskDataDoc, NewIUploadTaskDataItem } from './uploadedTask.interfaces';
import type { IUploadTaskDoc, NewIUploadTaskDocData, UploadStatus } from './uploadedTask.interfaces';

/*************************************************
 *
 *            UPLOAD TASK RELATED
 *
 ************************************************/

/**
 * Create a new upload task
 * @param {NewIUploadTaskDocData} data - The data for the new upload task
 * @returns {Promise<IUploadTaskDoc>} - The created upload task document
 */
export const createTask = async (data: NewIUploadTaskDocData): Promise<IUploadTaskDoc> => {
  return UploadTask.create(data);
};

/**
 * Get task by id
 * @param {mongoose.Types.ObjectId} taskId - The ID of the task to retrieve
 * @returns {Promise<IUploadTaskDoc | null>} - The task document or null if not found
 */
export const getTaskById = async (taskId: mongoose.Types.ObjectId): Promise<IUploadTaskDoc | null> => {
  const task = await UploadTask.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  return task;
};

/**
 * Mark task as done successfully
 * @param {mongoose.Types.ObjectId} taskId - The ID of the task to mark as done
 * @returns {Promise<IUploadTaskDoc | null>} - The updated task document or null if not found
 */
export const updateStatus = async (
  taskId: mongoose.Types.ObjectId,
  status: UploadStatus
): Promise<IUploadTaskDoc | null> => {
  const task = await UploadTask.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  task.status = status;
  await task.save();
  return task;
};

/*************************************************
 *
 *            UPLOAD TASK DATA RELATED
 *
 ************************************************/

/**
 * Create data for a task
 * @param {mongoose.Types.ObjectId} taskId - The ID of the task to associate the data with
 * @param {NewIUploadTaskDataItem[]} items - The data items to create
 * @returns {Promise<IUploadTaskDataDoc[] | null>} - The created task data documents or null if creation fails
 */
export const createTaskData = async (
  taskId: mongoose.Types.ObjectId,
  items: NewIUploadTaskDataItem[]
): Promise<IUploadTaskDataDoc[] | null> => {
  const data = items.map((data) => ({ data, uploadTask: taskId }));
  return UploadTaskData.create(data);
};

/**
 * Get a list of data for a task with pagination
 * @param {mongoose.Types.ObjectId} taskId - The ID of the task to retrieve data for
 * @param {number} page - The page number for pagination
 * @param {number} limit - The number of items per page
 * @returns {Promise<{ data: IUploadTaskDataDoc[], total: number }>} - The list of data and total count
 */
export const getTaskData = async (
  taskId: mongoose.Types.ObjectId,
  page: number,
  limit: number
): Promise<{ data: IUploadTaskDataDoc['data'][]; total: number; page: number; limit: number }> => {
  const task = await UploadTask.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    UploadTaskData.find({ uploadTask: taskId }, 'data -_id').skip(skip).limit(limit),
    UploadTaskData.countDocuments({ uploadTask: taskId }),
  ]);
  return { data: data.map((a) => a.data), total, page, limit };
};

/*************************************************
 *
 *            UPLOAD TASK ERRORS RELATED
 *
 ************************************************/

/**
 * Create errors for a task
 * @param {mongoose.Types.ObjectId} taskId - The ID of the task to associate the errors with
 * @param {NewIUploadTaskError[]} error - The error items to create
 * @returns {Promise<IUploadTaskErrorDoc[] | null>} - The created task error documents or null if creation fails
 */
export const createTaskErrors = async (
  taskId: mongoose.Types.ObjectId,
  error: NewIUploadTaskError[]
): Promise<IUploadTaskErrorDoc[] | null> => {
  return UploadTaskError.create(error.map((item) => ({ ...item, uploadTask: taskId })));
};

/**
 * Get a list of errors for a task with pagination and sorting by row and column number
 * @param {mongoose.Types.ObjectId} taskId - The ID of the task to retrieve errors for
 * @param {number} page - The page number for pagination
 * @param {number} limit - The number of items per page
 * @returns {Promise<{ errors: IUploadTaskErrorDoc[], total: number }>} - The list of errors and total count
 */
export const getTaskErrors = async (
  taskId: mongoose.Types.ObjectId,
  page: number,
  limit: number
): Promise<{ errors: IUploadTaskErrorDoc[]; total: number; page: number; limit: number }> => {
  const task = await UploadTask.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const skip = (page - 1) * limit;
  const [errors, total] = await Promise.all([
    UploadTaskError.find({ uploadTask: taskId }, 'row column message -_id')
      .sort({ row: 1, column: 1 })
      .skip(skip)
      .limit(limit),
    UploadTaskError.countDocuments({ uploadTask: taskId }),
  ]);
  return { errors, total, page, limit };
};

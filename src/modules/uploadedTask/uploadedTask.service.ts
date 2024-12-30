// Utils
import httpStatus from 'http-status';

// Models
import mongoose from 'mongoose';
import UploadTask, { UploadTaskData, UploadTaskError } from './uploadedTask.model';

// Interfaces
import { ApiError } from '../errors';
import type { QueryResult } from '../paginate/paginate';
import type { IUploadTaskErrorDoc, NewIUploadTaskError } from './uploadedTask.interfaces';
import type { IUploadTaskDataDoc, NewIUploadTaskDataItem } from './uploadedTask.interfaces';
import type { IUploadTaskDoc, NewIUploadTaskDocData, UploadStatus } from './uploadedTask.interfaces';

interface PaginateOptions {
  page?: number;
  limit?: number;

  row?: number | string | any;
  column?: number | string | any;
}

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
 * @param {number} row - The row number to filter by
 * @param {number} column - The column number to filter by
 */
export const getTaskData = async (taskId: mongoose.Types.ObjectId, options: PaginateOptions) => {
  const task = await UploadTask.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  const { page, limit, row, column } = options;

  const filters: Record<string, any> = { uploadTask: taskId };
  if (row) filters['row'] = row;
  if (column) filters['column'] = column;

  const data = await UploadTaskData.paginate(filters, { page, limit, projectBy: 'data -_id' });

  return { ...data, results: data.results.map((a) => (a as IUploadTaskDataDoc).data) };
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
 * @param {number} row - The row number to filter by
 * @param {number} column - The column number to filter by
 * @returns {Promise<{ errors: IUploadTaskErrorDoc[], total: number }>} - The list of errors and total count
 */
export const getTaskErrors = async (
  taskId: mongoose.Types.ObjectId,
  options: PaginateOptions
): Promise<QueryResult> => {
  const task = await UploadTask.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const { page, limit, row, column } = options;

  const filters: Record<string, any> = { uploadTask: taskId };
  if (row) filters['row'] = row;
  if (column) filters['column'] = column;

  return UploadTaskError.paginate(filters, { page, limit, projectBy: 'row column message -_id' });
};

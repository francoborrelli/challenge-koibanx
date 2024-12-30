import mongoose from 'mongoose';

// Utils
import httpStatus from 'http-status';
import { catchAsync } from '../../utils';
import { processTask } from './uploadedTask.utils';

// Services
import * as taskService from './uploadedTask.service';

// Constants
import { AVAILABLE_FORTATTERS } from './uploadedTask.constants';

// Interfaces
import type { Request, Response } from 'express';

/*************************************************
 *
 *            UPLOAD TASK RELATED
 *
 ************************************************/

/**
 * Creates a new task from the uploaded file and processes it.
 *
 * @param req - The request object containing the file and body.
 * @param res - The response object to send the result.
 *
 * @returns A response with the created task's initial data or an error message if no file is uploaded.
 *
 * @throws Will throw an error if task creation or processing fails.
 */
export const createTask = catchAsync(async (req: Request, res: Response) => {
  const { file, body } = req;

  if (!file) return res.status(httpStatus.BAD_REQUEST).send('No file uploaded');
  const { filename, path: filepath } = file;

  const { formatter } = body;

  const task = await taskService.createTask({ filename, filepath, formatter });

  await processTask(task._id as string);

  res.status(httpStatus.CREATED).send(task.getInitial());
});

/**
 * Retrieves the status of a task based on the provided task ID.
 *
 * @param req - The request object containing the task ID in the parameters.
 * @param res - The response object used to send back the task status.
 *
 * @returns A promise that resolves to sending the task status in the response.
 *
 * @throws Will throw an error if the task ID is not a string or if the task cannot be found.
 */
export const getTaskStatus = catchAsync(async (req: Request, res: Response) => {
  const task = await taskService.getTaskById(new mongoose.Types.ObjectId(req.params['taskId']));
  res.send({ status: task?.status });
});

/**
 * Handles the request to get available formatters.
 *
 * This function is an asynchronous handler that sends the list of available formatters
 * in the response. It uses the `catchAsync` utility to handle any potential errors
 * that may occur during the execution of the asynchronous operation.
 *
 * @param req - The request object from the client.
 * @param res - The response object to send the data back to the client.
 *
 * @returns A promise that resolves to sending the list of available formatters.
 */
export const getFormatters = catchAsync(async (req: Request, res: Response) => {
  res.send(AVAILABLE_FORTATTERS);
});

/*************************************************
 *
 *            UPLOAD TASK DATA RELATED
 *
 ************************************************/

/**
 * Retrieves the data associated with a specific task.
 *
 * This function is an asynchronous handler for fetching task data based on the provided task ID.
 * It uses the `catchAsync` utility to handle any errors that may occur during execution.
 *
 * @param {Request} req - The request object, containing the task ID in the parameters.
 * @param {Response} res - The response object, used to send back the task data.
 *
 * @throws {ApiError} If the task is not found, an ApiError with a 404 status code is thrown.
 */
export const getTaskData = catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const data = await taskService.getTaskData(new mongoose.Types.ObjectId(req.params['taskId']), page, limit);
  res.send(data);
});

/*************************************************
 *
 *            UPLOAD TASK ERROR RELATED
 *
 ************************************************/

/**
 * Retrieves the errors associated with a specific task.
 *
 * This function is an asynchronous handler for fetching task errors based on the provided task ID.
 * It uses the `catchAsync` utility to handle any errors that may occur during execution.
 *
 * @param {Request} req - The request object, containing the task ID in the parameters.
 * @param {Response} res - The response object, used to send back the task errors data.
 *
 * @throws {ApiError} If the task is not found, an ApiError with a 404 status code is thrown.
 */
export const getTaskErrors = catchAsync(async (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const errors = await taskService.getTaskErrors(new mongoose.Types.ObjectId(req.params['taskId']), page, limit);
  res.send(errors);
});

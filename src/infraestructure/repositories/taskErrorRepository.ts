import mongoose from 'mongoose';
import { UploadTaskError } from '../models/taskErrorModel';

// Interfaces
import type { IOptions } from '../models/utils/paginate/paginate.types';
import type { ITaskErrorRepository } from '../../domain/interfaces/taskRepository';
import type { NewIUploadTaskError, IUploadTaskError } from 'src/domain/entities/task';

export class MongoTasksErrorRepository implements ITaskErrorRepository {
  /**
   * Create errors for a task
   * @param {mongoose.Types.ObjectId} taskId - The ID of the task to associate the errors with
   * @param {NewIUploadTaskError[]} items - The error items to create
   * @returns {Promise<IUploadTaskError[] | null>} - The created task error documents or null if creation fails
   */
  async create(taskId: mongoose.Types.ObjectId, items: NewIUploadTaskError[]): Promise<IUploadTaskError[] | null> {
    const error = items.map((item) => ({ ...item, uploadTask: taskId }));
    return UploadTaskError.create(error.map((item) => ({ ...item, uploadTask: taskId })));
  }

  /**
   * Get a list of errors for a task with pagination and sorting by row and column number
   * @param {mongoose.Types.ObjectId} taskId - The ID of the task to retrieve errors for
   * @param {number} options.page - The page number for pagination
   * @param {number} options.limit - The number of items per page
   * @param {number} options.row - The row number to filter by
   * @param {number} options.column - The column number to filter by
   * @returns {Promise<{ errors: IUploadTaskError[], total: number }>} - The list of errors and total count
   */
  async getTaskErrors(
    taskId: mongoose.Types.ObjectId,
    options: IOptions & { column: number | string; row: number | string }
  ): Promise<any> {
    const { page, limit, row, column } = options;
    const filters: Record<string, any> = { uploadTask: taskId };
    if (row) filters['row'] = row;
    if (column) filters['column'] = column;
    return UploadTaskError.paginate(filters, { page, limit, projectBy: 'row column message -_id' });
  }
}

import mongoose from 'mongoose';
import { UploadTaskData } from '../models/taskDataModel';

// Interfaces
import type { IOptions } from '../models/utils/paginate/paginate.types';
import type { ITaskDataRepository } from '../../domain/interfaces/taskRepository';
import type { IUploadTaskData, NewIUploadTaskDataItem } from '../../domain/entities/task';

export class MongoTasksDataRepository implements ITaskDataRepository {
  /**
   * Create data for a task
   * @param {mongoose.Types.ObjectId} taskId - The ID of the task to associate the data with
   * @param {NewIUploadTaskDataItem[]} items - The data items to create
   * @returns {Promise<IUploadTaskDataDoc[] | null>} - The created task data documents or null if creation fails
   */
  async create(taskId: mongoose.Types.ObjectId, items: NewIUploadTaskDataItem[]): Promise<IUploadTaskData[] | null> {
    const data = items.map((data) => ({ data, uploadTask: taskId }));
    return await UploadTaskData.create(data);
  }

  /**
   * Get a list of data for a task with pagination
   * @param {mongoose.Types.ObjectId} taskId - The ID of the task to retrieve data for
   * @param {number} options.page - The page number for pagination
   * @param {number} options.limit - The number of items per page
   * @param {number} options.row - The row number to filter by
   * @param {number} options.column - The column number to filter by
   */
  async getTaskData(
    taskId: mongoose.Types.ObjectId,
    options: IOptions & { column: number | string; row: number | string }
  ): Promise<any> {
    const { page, limit, row, column } = options;
    const filters: Record<string, any> = { uploadTask: taskId };
    if (row) filters['row'] = row;
    if (column) filters['column'] = column;
    const data = await UploadTaskData.paginate(filters, { page, limit, projectBy: 'data -_id' });
    return { ...data, results: (data.results as unknown as IUploadTaskData[]).map((a) => a.data) };
  }
}

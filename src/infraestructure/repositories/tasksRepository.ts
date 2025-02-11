import { TaskModel } from '../models/taskModel';

// Interfaces
import type { QueryResult } from '../../domain/entities/pagination';
import type { IOptions } from '../models/utils/paginate/paginate.types';
import type { ITaskRepository } from '../../domain/interfaces/taskRepository';
import type { IUploadTask, NewIUploadTaskDocData } from '../../domain/entities/task';

export class MongoTasksRepository implements ITaskRepository {
  /**
   * Get all tasks
   * @returns {Promise<IUploadTaskDoc[]>} - The list of task documents
   */
  async findAll(): Promise<IUploadTask[]> {
    return await TaskModel.find();
  }

  /**
   * Get task by id
   * @param {mongoose.Types.ObjectId} taskId - The ID of the task to retrieve
   * @returns {Promise<IUploadTaskDoc | null>} - The task document or null if not found
   */
  async findById(id: string): Promise<IUploadTask | null> {
    return await TaskModel.findById(id);
  }

  /**
   * Get task by email
   * @param {string} email - The email of the task to retrieve
   * @returns {Promise<IUploadTaskDoc | null>} - The task document or null if not found
   */
  async findByEmail(email: string): Promise<IUploadTask | null> {
    return await TaskModel.findOne({
      email,
    });
  }

  /**
   * Create a new task
   * @param {NewIUploadTaskDocData} task - The task data to create
   * @returns {Promise<IUploadTaskDoc>} - The created task document
   */
  async create(task: NewIUploadTaskDocData): Promise<IUploadTask> {
    const newTask = new TaskModel(task);
    await newTask.save();
    return newTask;
  }

  /**
   * Update a task
   * @param {IUploadTaskDoc} task - The task data to update
   * @returns {Promise<void>}
   */
  async update(id: string, task: Partial<IUploadTask>): Promise<void> {
    await TaskModel.findByIdAndUpdate(id, task);
  }

  /**
   * Delete a task
   * @param {mongoose.Types.ObjectId} taskId - The ID of the task to delete
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await TaskModel.findByIdAndDelete(id);
  }

  /**
   * Query tasks with pagination
   * @param {Record<string, any>} filter - The filter to apply
   * @param {IOptions} options - The pagination options
   * @returns {Promise<QueryResult>} - The paginated results
   */
  async query(filter: Record<string, any>, options: IOptions): Promise<QueryResult> {
    return await TaskModel.paginate(filter, options);
  }
}

import mongoose from 'mongoose';

import type { IUser, NewCreatedUser } from '../../domain/entities/user';
import type { IUserRepository } from '../../domain/interfaces/userRepository';

import { UserModel } from '../models/userModel';
import { IOptions, QueryResult } from '../models/utils/paginate/paginate.types';

export class MongoUserRepository implements IUserRepository {
  preprocessId(id: string) {
    if (!id) return null;
    if (typeof id === 'string') return new mongoose.Types.ObjectId(id);
    return id;
  }

  /**
   * Get all users
   * @returns {Promise<IUser[]>} - The list of user documents
   */
  async findAll(): Promise<IUser[]> {
    return await UserModel.find();
  }

  /**
   * Get user by id
   * @param {mongoose.Types.ObjectId} userId - The ID of the user to retrieve
   * @returns {Promise<IUser | null>} - The user document or null if not found
   */
  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(this.preprocessId(id));
  }

  /**
   * Get user by email
   * @param {string} email - The email of the user to retrieve
   * @returns {Promise<IUser | null>} - The user document or null if not found
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  /**
   * Create a new user
   * @param {NewCreatedUser} user - The user data to create
   * @returns {Promise<IUser>} - The created user document
   */
  async create(user: NewCreatedUser): Promise<IUser> {
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser;
  }

  /**
   * Update an existing user
   * @param {IUser} user - The user data to update
   * @returns {Promise<void>}
   */
  async update(id: string, user: IUser): Promise<void> {
    await UserModel.findByIdAndUpdate(this.preprocessId(id), user);
  }

  /**
   * Delete a user by id
   * @param {string} id - The ID of the user to delete
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(this.preprocessId(id));
  }

  /**
   * Query users with pagination
   * @param {Record<string, any>} filter - The filter criteria
   * @param {IOptions} options - The pagination options
   * @returns {Promise<QueryResult>} - The paginated result
   */
  async query(filter: Record<string, any>, options: IOptions): Promise<QueryResult> {
    return await UserModel.paginate(filter, options);
  }
}

// Models
import mongoose from 'mongoose';
import User from './user.model';

// Utils
import httpStatus from 'http-status';

// Interfaces
import ApiError from '../errors/ApiError';
import type { IOptions, QueryResult } from '../paginate/paginate';
import type { NewCreatedUser, UpdateUserBody, IUserDoc, NewRegisteredUser } from './user.interfaces';

/**
 * Create a new user
 * @param {NewCreatedUser} userBody - The user information to create
 * @returns {Promise<IUserDoc>} - The created user document
 */
export const createUser = async (userBody: NewCreatedUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Register a new user
 * @param {NewRegisteredUser} userBody - The user information to register
 * @returns {Promise<IUserDoc>} - The registered user document
 */
export const registerUser = async (userBody: NewRegisteredUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Record<string, any>} filter - Mongo filter
 * @param {IOptions} options - Query options
 * @returns {Promise<QueryResult>} - The query result containing users
 */
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id - The id of the user
 * @returns {Promise<IUserDoc | null>} - The user document or null if not found
 */
export const getUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> => User.findById(id);

/**
 * Get user by email
 * @param {string} email - The email of the user
 * @returns {Promise<IUserDoc | null>} - The user document or null if not found
 */
export const getUserByEmail = async (email: string): Promise<IUserDoc | null> => User.findOne({ email });

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId - The id of the user to update
 * @param {UpdateUserBody} updateBody - The new user data to update
 * @returns {Promise<IUserDoc | null>} - The updated user document or null if not found
 */
export const updateUserById = async (
  userId: mongoose.Types.ObjectId,
  updateBody: UpdateUserBody
): Promise<IUserDoc | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} userId - The id of the user to delete
 * @returns {Promise<IUserDoc | null>} - The deleted user document or null if not found
 */
export const deleteUserById = async (userId: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.deleteOne();
  return user;
};

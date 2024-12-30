// Utils
import httpStatus from 'http-status';

// Models
import mongoose from 'mongoose';
import Token from '../token/token.model';

// Services
import { generateAuthTokens, verifyToken } from '../token/token.service';
import { getUserByEmail, getUserById, updateUserById } from '../user/user.service';

// Interfaces
import ApiError from '../errors/ApiError';
import tokenTypes from '../token/token.types';
import type { IUserDoc, IUserWithTokens } from '../user/user.interfaces';

/**
 * Login with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<IUserDoc>} - Returns a promise that resolves to the user document
 * @throws {ApiError} - Throws an error if the email or password is incorrect
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUserDoc> => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken - The refresh token to be invalidated
 * @returns {Promise<void>} - Returns a promise that resolves when the token is invalidated
 * @throws {ApiError} - Throws an error if the token is not found
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken - The refresh token to be verified and used for generating new tokens
 * @returns {Promise<IUserWithTokens>} - Returns a promise that resolves to the user with new auth tokens
 * @throws {ApiError} - Throws an error if the refresh token is invalid or the user is not found
 */
export const refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await getUserById(new mongoose.Types.ObjectId(refreshTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.deleteOne();
    const tokens = await generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken - The token used to reset the password
 * @param {string} newPassword - The new password to be set
 * @returns {Promise<void>} - Returns a promise that resolves when the password is reset
 * @throws {ApiError} - Throws an error if the token is invalid or the user is not found
 */
export const resetPassword = async (resetPasswordToken: any, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await getUserById(new mongoose.Types.ObjectId(resetPasswordTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken - The token used to verify the email
 * @returns {Promise<IUserDoc | null>} - Returns a promise that resolves to the user document if verification is successful, or null if the user is not found
 * @throws {ApiError} - Throws an error if the token is invalid or the user is not found
 */
export const verifyEmail = async (verifyEmailToken: any): Promise<IUserDoc | null> => {
  try {
    const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await getUserById(new mongoose.Types.ObjectId(verifyEmailTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    const updatedUser = await updateUserById(user.id, { isEmailVerified: true });
    return updatedUser;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

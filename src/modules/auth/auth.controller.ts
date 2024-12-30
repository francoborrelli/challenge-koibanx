import httpStatus from 'http-status';

// Utils
import catchAsync from '../../utils/catchAsync';

// Services
import { userService } from '../user';
import { tokenService } from '../token';
import * as authService from './auth.service';

// Interfaces
import type { Request, Response } from 'express';
import type { NewRegisteredUser } from '../user/user.interfaces';

/**
 * Registers a new user and generates authentication tokens.
 *
 * @param {Request} req - The request object containing user registration details in the body.
 * @param {Response} res - The response object used to send back the created user and tokens.
 *
 *
 * @body {string} email - The email of the new user.
 * @body {string} password - The password of the new user.
 * @body {string} name - The name of the new user.
 *
 * @returns {Promise<void>} - A promise that resolves when the user is registered and tokens are generated.
 */
export const register = catchAsync(async (req: Request, res: Response) => {
  const body = req.body as NewRegisteredUser;
  const user = await userService.registerUser(body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

/**
 * Logs in a user with email and password and generates authentication tokens.
 *
 * @param {Request} req - The request object containing user login details in the body.
 * @param {Response} res - The response object used to send back the authenticated user and tokens.
 *
 * @body {string} email - The email of the user.
 * @body {string} password - The password of the user.
 *
 * @returns {Promise<void>} - A promise that resolves when the user is authenticated and tokens are generated.
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

/**
 * Handles the logout process for a user.
 *
 * This function is an asynchronous handler that logs out a user by invalidating their refresh token.
 * It uses the `catchAsync` utility to handle any errors that may occur during the process.
 *
 * @param req - The request object, containing the refresh token in the body.
 * @param res - The response object, used to send the status code and response.
 *
 * @returns A promise that resolves to a response with no content.
 */
export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Refreshes the authentication tokens for a user.
 *
 * This function is an asynchronous handler that catches any errors during the process.
 * It expects a request containing a refresh token in the body, and uses the authService
 * to refresh the authentication tokens for the user associated with the provided refresh token.
 *
 * @param req - The request object, containing the refresh token in the body.
 * @param res - The response object, used to send back the refreshed tokens.
 * @returns A promise that resolves to sending the user object with refreshed tokens.
 */
export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...userWithTokens });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  // const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  // TODO: ADD SEND RESET PASSWORD TOKEN - OUT OF SCOPE FOR THIS PROJECT
  res.status(httpStatus.NO_CONTENT).send();
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.query['token'], req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

export const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  // const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  // TODO: ADD SEND VERIFICATION EMAIL IMPLEMENTATION - OUT OF SCOPE FOR THIS PROJECT
  res.status(httpStatus.NO_CONTENT).send();
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  await authService.verifyEmail(req.query['token']);
  res.status(httpStatus.NO_CONTENT).send();
});

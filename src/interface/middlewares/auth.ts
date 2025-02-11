// Utils
import passport from 'passport';
import httpStatus from 'http-status';

// Constants
import { roleRights } from '../../domain/constants/roles';

import ApiError from '../../domain/entities/apiError';

// Interfaces
import type { IUser } from '../../domain/entities/user';
import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware function to verify user authentication and authorization.
 *
 * @param {Request} req - The Express request object.
 * @param {Function} resolve - The function to call when verification is successful.
 * @param {Function} reject - The function to call when verification fails.
 * @param {string[]} requiredRights - An array of required rights for the route.
 * @returns {Function} - A function that handles the verification process.
 *
 * @async
 * @function
 * @param {Error} err - An error object if an error occurred during verification.
 * @param {IUserDoc} user - The authenticated user document.
 * @param {string} info - Additional information about the authentication process.
 *
 * @throws {ApiError} - Throws an error if authentication fails or the user does not have the required rights.
 */
const verifyCallback =
  (req: Request, resolve: any, reject: any, requiredRights: string[]) =>
  async (err: Error, user: IUser, info: string) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);

      if (!userRights) return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      const hasRequiredRights = requiredRights.every((requiredRight: string) => userRights.includes(requiredRight));
      if (!hasRequiredRights && req.params['userId'] !== user._id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    resolve();
  };

/**
 * Middleware to handle authentication and authorization using Passport.js.
 *
 * This middleware authenticates the user using the 'jwt' strategy and checks if the user has the required rights.
 *
 * @param {...string} requiredRights - The rights required to access the route.
 * @returns {Function} A middleware function that authenticates the user and checks their rights.
 *
 * @example
 * // Usage in a route
 * app.get('/protected-route', authMiddleware('admin', 'user'), (req, res) => {
 *   res.send('This is a protected route');
 * });
 *
 * @async
 * @function
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>} A promise that resolves if the user is authenticated and has the required rights, or rejects with an error.
 */
const authMiddleware =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) =>
    new Promise<void>((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(
        req,
        res,
        next
      );
    })
      .then(() => next())
      .catch((err) => next(err));

export default authMiddleware;

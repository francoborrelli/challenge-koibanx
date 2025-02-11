import type { Request, Response, NextFunction } from 'express';

/**
 * A higher-order function that wraps an asynchronous function and catches any errors that occur,
 * passing them to the next middleware in the Express.js request-response cycle.
 *
 * @param fn - The asynchronous function to be wrapped. It should accept `req`, `res`, and `next` as parameters.
 * @returns A function that takes `req`, `res`, and `next` as parameters and executes the wrapped function,
 *          catching any errors and passing them to the next middleware.
 */
const catchAsync = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default catchAsync;

// Utils
import Joi from 'joi';
import httpStatus from 'http-status';
import pick from '../../shared/utils/pick';
import ApiError from '../../domain/entities/apiError';

// Interfaces
import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware to validate request objects against a given Joi schema.
 *
 * @param {Record<string, any>} schema - The Joi schema to validate against. Should contain keys like 'params', 'query', and 'body'.
 * @returns {(req: Request, _res: Response, next: NextFunction) => void} Middleware function that validates the request.
 *
 * The middleware picks the relevant parts of the request (params, query, body) and validates them against the provided schema.
 * If validation fails, it passes an ApiError to the next middleware with a BAD_REQUEST status and the validation error messages.
 * If validation succeeds, it assigns the validated values back to the request object and calls the next middleware.
 */
const validate =
  (schema: Record<string, any>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' } })
      .validate(object);

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
  };

export default validate;

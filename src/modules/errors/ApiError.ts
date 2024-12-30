/**
 * Class representing an API error.
 * @extends Error
 */
class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  override stack?: string;

  /**
   * Creates an API error.
   * @param {number} statusCode - The HTTP status code of the error.
   * @param {string} message - The error message.
   * @param {boolean} [isOperational=true] - Whether the error is operational.
   * @param {string} [stack=''] - The stack trace of the error.
   */
  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;

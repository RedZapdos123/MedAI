/**
 * Centralized error handler middleware.
 */
export function errorHandler(err, req, res, next) {
  console.error('[Error]', err);

  const statusCode = err.statusCode || 500;
  const code = err.code || 'SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';
  const details = err.details || {};

  res.status(statusCode).json({
    error: {
      code,
      message,
      details
    }
  });
}

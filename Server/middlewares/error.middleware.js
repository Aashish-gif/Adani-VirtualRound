import ApiError from '../utils/ApiError.js';

export const errorMiddleware = (err, req, res, next) => {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    message,
    errors: err.errors || [],
  });
};

import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return next(new ApiError(401, 'Authentication required'));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role, teamId }
    next();
  } catch (e) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

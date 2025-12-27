import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.js';

export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-password').populate('teamId');
  res.json({ success: true, data: users });
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const allowed = ['name', 'avatar', 'role', 'teamId'];
  const payload = {};
  for (const key of allowed) if (key in req.body) payload[key] = req.body[key];

  if (payload.role && !['admin', 'manager', 'technician', 'employee'].includes(payload.role)) {
    return next(new ApiError(400, 'Invalid role'));
  }

  const user = await User.findByIdAndUpdate(id, payload, { new: true }).select('-password').populate('teamId');
  if (!user) return next(new ApiError(404, 'User not found'));
  res.json({ success: true, data: user });
});

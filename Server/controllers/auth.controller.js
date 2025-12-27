import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.js';

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, teamId: user.teamId || null },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role = 'employee', avatar, teamId } = req.body;
  if (!name || !email || !password) {
    return next(new ApiError(400, 'name, email, password required'));
  }
  if (role !== 'employee') {
    return next(new ApiError(403, 'Only employee role allowed at registration'));
  }

  const existing = await User.findOne({ email });
  if (existing) return next(new ApiError(409, 'Email already in use'));

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role, avatar, teamId });
  const token = signToken(user);
  res.status(201).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, teamId: user.teamId },
    token,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new ApiError(400, 'email and password required'));

  const user = await User.findOne({ email });
  if (!user) return next(new ApiError(401, 'Invalid credentials'));

  const match = await bcrypt.compare(password, user.password);
  if (!match) return next(new ApiError(401, 'Invalid credentials'));

  const token = signToken(user);
  res.json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, teamId: user.teamId },
    token,
  });
});

export const me = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password').populate('teamId');
  if (!user) return next(new ApiError(404, 'User not found'));
  res.json({ success: true, data: user });
});

import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import MaintenanceTeam from '../models/MaintenanceTeam.js';
import User from '../models/User.js';

export const createTeam = asyncHandler(async (req, res, next) => {
  const { name, members = [] } = req.body;
  if (!name) return next(new ApiError(400, 'name required'));

  // Validate members exist
  if (members.length) {
    const count = await User.countDocuments({ _id: { $in: members } });
    if (count !== members.length) return next(new ApiError(400, 'One or more members invalid'));
  }

  const team = await MaintenanceTeam.create({ name, members });
  res.status(201).json({ success: true, data: team });
});

export const getTeams = asyncHandler(async (req, res, next) => {
  const teams = await MaintenanceTeam.find().populate('members');
  res.json({ success: true, data: teams });
});

export const getTeamById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const team = await MaintenanceTeam.findById(id).populate('members');
  if (!team) return next(new ApiError(404, 'Team not found'));
  res.json({ success: true, data: team });
});

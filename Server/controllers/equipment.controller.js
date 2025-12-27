import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Equipment from '../models/Equipment.js';
import User from '../models/User.js';
import MaintenanceTeam from '../models/MaintenanceTeam.js';

export const createEquipment = asyncHandler(async (req, res, next) => {
  const {
    name,
    serialNumber,
    department,
    assignedEmployee,
    maintenanceTeamId,
    defaultTechnicianId,
    purchaseDate,
    warrantyExpiry,
    location,
  } = req.body;

  if (!name || !serialNumber || !department || !purchaseDate || !location) {
    return next(new ApiError(400, 'Missing required fields'));
  }

  if (assignedEmployee) {
    const user = await User.findById(assignedEmployee);
    if (!user) return next(new ApiError(400, 'assignedEmployee invalid'));
  }
  if (maintenanceTeamId) {
    const team = await MaintenanceTeam.findById(maintenanceTeamId);
    if (!team) return next(new ApiError(400, 'maintenanceTeamId invalid'));
  }
  if (defaultTechnicianId) {
    const tech = await User.findById(defaultTechnicianId);
    if (!tech || tech.role !== 'technician') return next(new ApiError(400, 'defaultTechnicianId must be a technician'));
  }

  const equipment = await Equipment.create({
    name,
    serialNumber,
    department,
    assignedEmployee,
    maintenanceTeamId,
    defaultTechnicianId,
    purchaseDate,
    warrantyExpiry,
    location,
  });

  res.status(201).json({ success: true, data: equipment });
});

export const getEquipment = asyncHandler(async (req, res, next) => {
  const items = await Equipment.find().populate('assignedEmployee maintenanceTeamId defaultTechnicianId');
  res.json({ success: true, data: items });
});

export const getEquipmentById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const equipment = await Equipment.findById(id).populate('assignedEmployee maintenanceTeamId defaultTechnicianId');
  if (!equipment) return next(new ApiError(404, 'Equipment not found'));
  res.json({ success: true, data: equipment });
});

export const updateEquipment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const allowed = [
    'name',
    'serialNumber',
    'department',
    'assignedEmployee',
    'maintenanceTeamId',
    'defaultTechnicianId',
    'purchaseDate',
    'warrantyExpiry',
    'location',
    'isScrapped',
  ];
  const payload = {};
  for (const key of allowed) if (key in req.body) payload[key] = req.body[key];

  if (payload.defaultTechnicianId) {
    const tech = await User.findById(payload.defaultTechnicianId);
    if (!tech || tech.role !== 'technician') return next(new ApiError(400, 'defaultTechnicianId must be a technician'));
  }

  const equipment = await Equipment.findByIdAndUpdate(id, payload, { new: true });
  if (!equipment) return next(new ApiError(404, 'Equipment not found'));
  res.json({ success: true, data: equipment });
});

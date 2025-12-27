import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import MaintenanceRequest from '../models/MaintenanceRequest.js';
import Equipment from '../models/Equipment.js';

const validTransition = (from, to, userRole) => {
  if (to === 'scrap') return true; // any -> scrap
  if (from === to) return false; // no change
  
  // Admins and managers can set any status
  if (userRole === 'admin' || userRole === 'manager') return true;
  
  // Technicians can move forward in the workflow
  const order = ['new', 'in-progress', 'repaired'];
  const iFrom = order.indexOf(from);
  const iTo = order.indexOf(to);
  
  // Allow forward movement (can skip steps too)
  return iFrom !== -1 && iTo !== -1 && iTo > iFrom;
};

const computeOverdue = (scheduledDate, status) => {
  if (!scheduledDate) return false;
  const now = new Date();
  return scheduledDate < now && status !== 'repaired';
};

export const createRequest = asyncHandler(async (req, res, next) => {
  const { type, subject, equipmentId, scheduledDate, durationHours } = req.body;
  if (!type || !subject || !equipmentId) return next(new ApiError(400, 'Missing required fields'));
  if (!['corrective', 'preventive'].includes(type)) return next(new ApiError(400, 'Invalid type'));

  const equipment = await Equipment.findById(equipmentId);
  if (!equipment) return next(new ApiError(404, 'Equipment not found'));
  if (equipment.isScrapped) return next(new ApiError(400, 'Cannot create request for scrapped equipment'));

  const maintenanceTeamId = equipment.maintenanceTeamId || undefined;
  const technicianId = equipment.defaultTechnicianId || undefined;

  const status = 'new';
  const isOverdue = computeOverdue(scheduledDate ? new Date(scheduledDate) : null, status);

  const request = await MaintenanceRequest.create({
    type,
    subject,
    equipmentId,
    maintenanceTeamId,
    technicianId,
    status,
    scheduledDate,
    durationHours,
    isOverdue,
    createdBy: req.user.id,
  });

  await request.populate([
    { path: 'equipmentId' },
    { path: 'maintenanceTeamId' },
    { path: 'technicianId' },
    { path: 'createdBy' },
  ]);
  const populated = request;

  res.status(201).json({ success: true, data: populated });
});

export const getRequests = asyncHandler(async (req, res, next) => {
  // Build filter from query parameters
  const filter = {};
  
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;
  if (req.query.equipmentId) filter.equipmentId = req.query.equipmentId;
  if (req.query.maintenanceTeamId) filter.maintenanceTeamId = req.query.maintenanceTeamId;
  if (req.query.teamId) filter.maintenanceTeamId = req.query.teamId;
  if (req.query.technicianId) filter.technicianId = req.query.technicianId;
  if (req.query.assignedToId) filter.technicianId = req.query.assignedToId;
  if (req.query.createdBy) filter.createdBy = req.query.createdBy;
  if (req.query.requestedById) filter.createdBy = req.query.requestedById;
  
  const requests = await MaintenanceRequest.find(filter)
    .populate('equipmentId')
    .populate('maintenanceTeamId')
    .populate('technicianId')
    .populate('createdBy')
    .sort({ createdAt: -1 });

  // Update overdue flags on the fly (non-destructive)
  const updates = [];
  for (const r of requests) {
    const overdue = computeOverdue(r.scheduledDate, r.status);
    if (overdue !== r.isOverdue) {
      updates.push(MaintenanceRequest.updateOne({ _id: r._id }, { $set: { isOverdue: overdue } }));
      r.isOverdue = overdue;
    }
  }
  if (updates.length) await Promise.all(updates);

  res.json({ success: true, data: requests });
});

export const getRequestById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const r = await MaintenanceRequest.findById(id)
    .populate('equipmentId')
    .populate('maintenanceTeamId')
    .populate('technicianId')
    .populate('createdBy');
  if (!r) return next(new ApiError(404, 'Request not found'));
  // update overdue if needed
  const overdue = computeOverdue(r.scheduledDate, r.status);
  if (overdue !== r.isOverdue) {
    r.isOverdue = overdue;
    await r.save();
  }
  res.json({ success: true, data: r });
});

export const updateRequest = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const allowed = [
    'type',
    'subject',
    'maintenanceTeamId',
    'technicianId',
    'status',
    'scheduledDate',
    'durationHours',
  ];
  const payload = {};
  for (const key of allowed) if (key in req.body) payload[key] = req.body[key];

  // Normalize status: accept both 'in_progress' (frontend) and 'in-progress' (backend)
  if (payload.status === 'in_progress') {
    payload.status = 'in-progress';
  }

  const request = await MaintenanceRequest.findById(id);
  if (!request) return next(new ApiError(404, 'Request not found'));

  if (payload.type && !['corrective', 'preventive'].includes(payload.type)) {
    return next(new ApiError(400, 'Invalid type'));
  }

  if (payload.status && payload.status !== request.status) {
    if (!validTransition(request.status, payload.status, req.user.role)) {
      return next(new ApiError(400, `Cannot change status from '${request.status}' to '${payload.status}'`));
    }
  }

  // Apply updates
  Object.assign(request, payload);

  // Scrap logic: if status -> scrap, mark equipment scrapped
  if (request.status === 'scrap') {
    const equipment = await Equipment.findById(request.equipmentId);
    if (equipment && !equipment.isScrapped) {
      equipment.isScrapped = true;
      await equipment.save();
    }
  }

  // Overdue recompute
  request.isOverdue = computeOverdue(request.scheduledDate, request.status);

  await request.save();
  await request.populate([
    { path: 'equipmentId' },
    { path: 'maintenanceTeamId' },
    { path: 'technicianId' },
    { path: 'createdBy' },
  ]);
  const populated = request;

  res.json({ success: true, data: populated });
});

export const getCalendar = asyncHandler(async (req, res, next) => {
  const preventive = await MaintenanceRequest.find({ type: 'preventive' }).select('scheduledDate subject status equipmentId')
    .populate('equipmentId');

  // Group by scheduledDate (date-only ISO string)
  const groups = {};
  for (const r of preventive) {
    const dateKey = r.scheduledDate ? new Date(r.scheduledDate).toISOString().slice(0, 10) : 'unscheduled';
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(r);
  }
  res.json({ success: true, data: groups });
});

export const getByEquipment = asyncHandler(async (req, res, next) => {
  const { equipmentId } = req.params;
  const requests = await MaintenanceRequest.find({ equipmentId })
    .populate('equipmentId')
    .populate('maintenanceTeamId')
    .populate('technicianId')
    .populate('createdBy');
  res.json({ success: true, data: requests });
});

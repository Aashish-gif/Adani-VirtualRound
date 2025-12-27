import { asyncHandler } from '../utils/asyncHandler.js';
import MaintenanceRequest from '../models/MaintenanceRequest.js';
import Equipment from '../models/Equipment.js';

export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  // Base filters based on role
  let requestFilter = {};
  let equipmentFilter = {};

  if (userRole === 'technician') {
    requestFilter.technicianId = userId;
  } else if (userRole === 'manager' && req.user.teamId) {
    requestFilter.maintenanceTeamId = req.user.teamId;
    equipmentFilter.maintenanceTeamId = req.user.teamId;
  } else if (userRole === 'employee') {
    requestFilter.createdBy = userId;
  }

  // Calculate date ranges
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Total equipment count
  const totalEquipment = await Equipment.countDocuments(equipmentFilter);

  // Active requests (new or in-progress)
  const activeRequests = await MaintenanceRequest.countDocuments({
    ...requestFilter,
    status: { $in: ['new', 'in-progress'] },
  });

  // Completed this month
  const completedThisMonth = await MaintenanceRequest.countDocuments({
    ...requestFilter,
    status: 'repaired',
    updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
  });

  // Overdue requests
  const overdueRequests = await MaintenanceRequest.countDocuments({
    ...requestFilter,
    isOverdue: true,
    status: { $nin: ['repaired', 'scrap'] },
  });

  // Requests by status
  const statusCounts = await MaintenanceRequest.aggregate([
    { $match: requestFilter },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const requestsByStatus = {
    new: 0,
    'in-progress': 0,
    repaired: 0,
    scrap: 0,
  };

  statusCounts.forEach((item) => {
    if (item._id in requestsByStatus) {
      requestsByStatus[item._id] = item.count;
    }
  });

  // Requests by type
  const typeCounts = await MaintenanceRequest.aggregate([
    { $match: requestFilter },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ]);

  const requestsByType = {
    corrective: 0,
    preventive: 0,
  };

  typeCounts.forEach((item) => {
    if (item._id in requestsByType) {
      requestsByType[item._id] = item.count;
    }
  });

  // Recent requests (last 5)
  const recentRequests = await MaintenanceRequest.find(requestFilter)
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('equipmentId')
    .populate('technicianId')
    .populate('maintenanceTeamId')
    .populate('createdBy');

  // Upcoming preventive maintenance (next 10)
  const upcomingMaintenance = await MaintenanceRequest.find({
    ...requestFilter,
    type: 'preventive',
    scheduledDate: { $gte: now },
    status: { $nin: ['repaired', 'scrap'] },
  })
    .sort({ scheduledDate: 1 })
    .limit(10)
    .populate('equipmentId')
    .populate('technicianId');

  res.json({
    success: true,
    data: {
      totalEquipment,
      activeRequests,
      completedThisMonth,
      overdueRequests,
      requestsByStatus,
      requestsByType,
      recentRequests,
      upcomingMaintenance,
    },
  });
});

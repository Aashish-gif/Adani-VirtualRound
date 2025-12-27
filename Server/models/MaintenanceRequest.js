import mongoose from 'mongoose';

const types = ['corrective', 'preventive'];
const statuses = ['new', 'in-progress', 'repaired', 'scrap'];

const MaintenanceRequestSchema = new mongoose.Schema(
  {
    type: { type: String, enum: types, required: true },
    subject: { type: String, required: true, trim: true },
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    maintenanceTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceTeam' },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: statuses, default: 'new', required: true },
    scheduledDate: { type: Date },
    durationHours: { type: Number },
    isOverdue: { type: Boolean, default: false, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('MaintenanceRequest', MaintenanceRequestSchema);

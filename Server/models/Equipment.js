import mongoose from 'mongoose';

const EquipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    serialNumber: { type: String, required: true, trim: true, unique: true },
    department: { type: String, required: true, trim: true },
    assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    maintenanceTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceTeam' },
    defaultTechnicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    purchaseDate: { type: Date, required: true },
    warrantyExpiry: { type: Date },
    location: { type: String, required: true, trim: true },
    isScrapped: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Equipment', EquipmentSchema);

import mongoose from 'mongoose';

const roles = ['admin', 'manager', 'technician', 'employee'];

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: roles, default: 'employee', required: true },
    avatar: { type: String },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceTeam' },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);

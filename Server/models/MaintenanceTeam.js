import mongoose from 'mongoose';

const MaintenanceTeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model('MaintenanceTeam', MaintenanceTeamSchema);

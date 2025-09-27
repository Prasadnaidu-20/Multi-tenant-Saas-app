import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  tenantId: { type: String, required: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['Member', 'Pro'], default: 'Member' },
  token: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'expired'], 
    default: 'pending' 
  },
  expiresAt: { type: Date, required: true },
  acceptedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Index for efficient queries
invitationSchema.index({ email: 1, tenantId: 1 });
invitationSchema.index({ token: 1 });
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Invitation', invitationSchema);

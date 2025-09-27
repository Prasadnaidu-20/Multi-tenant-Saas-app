import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  tenantId: { type: String, required: true }, // For multi-tenancy
  role: { type: String, enum: ['Admin', 'Member'], default: 'Member' }
});

export default mongoose.model('User', userSchema);

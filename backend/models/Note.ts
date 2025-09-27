import mongoose, { Schema } from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  content: {type:String},
  tenantId: { type: String, required: true }, // <--- enforce isolation
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });

noteSchema.index({ tenantId: 1 });

export default mongoose.model('Note', noteSchema);

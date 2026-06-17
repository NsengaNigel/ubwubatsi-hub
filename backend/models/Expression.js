const mongoose = require('mongoose');

const expressionSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  professionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

expressionSchema.index({ projectId: 1, professionalId: 1 }, { unique: true });

module.exports = mongoose.model('Expression', expressionSchema);

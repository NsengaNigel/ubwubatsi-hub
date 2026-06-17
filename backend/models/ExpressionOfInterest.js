const mongoose = require('mongoose');
const { Schema, Types: { ObjectId } } = mongoose;

const expressionOfInterestSchema = new Schema({
  projectId: { type: ObjectId, ref: 'Project', required: true },
  professionalId: { type: ObjectId, ref: 'User', required: true },
  clientId: { type: ObjectId, ref: 'User', required: true },
  message: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

expressionOfInterestSchema.index({ projectId: 1, professionalId: 1 }, { unique: true });

module.exports = mongoose.model('ExpressionOfInterest', expressionOfInterestSchema);

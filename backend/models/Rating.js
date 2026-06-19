const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const ratingSchema = new Schema({
  projectId: { type: ObjectId, ref: 'Project', required: true },
  clientId: { type: ObjectId, ref: 'User', required: true },
  professionalId: { type: ObjectId, ref: 'User', required: true },
  score: { type: Number, min: 1, max: 5, required: true },
  review: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

ratingSchema.index({ projectId: 1, clientId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);

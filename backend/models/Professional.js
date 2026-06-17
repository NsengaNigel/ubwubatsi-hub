const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialty: { type: String, enum: ['Architect', 'Civil Engineer', 'Both'] },
  bio: { type: String },
  location: { type: String },
  profilePicture: { type: String },
  portfolioImages: [{ type: String }],
  certifications: [{
    name: { type: String, required: true },
    issuingBody: { type: String },
    year: { type: String },
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  }],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Professional', professionalSchema);

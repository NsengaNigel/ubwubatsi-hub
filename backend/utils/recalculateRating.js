const mongoose = require('mongoose');
const Rating = require('../models/Rating');
const Professional = require('../models/Professional');

const recalculateRating = async (professionalUserId) => {
  const result = await Rating.aggregate([
    { $match: { professionalId: new mongoose.Types.ObjectId(professionalUserId.toString()) } },
    { $group: { _id: null, avg: { $avg: '$score' }, count: { $sum: 1 } } },
  ]);
  const avg = result[0]?.avg ?? 0;
  const count = result[0]?.count ?? 0;
  await Professional.findOneAndUpdate(
    { userId: professionalUserId },
    { averageRating: Math.round(avg * 10) / 10, totalReviews: count }
  );
};

module.exports = recalculateRating;

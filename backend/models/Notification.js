const mongoose = require('mongoose');
const { Schema, Types: { ObjectId } } = mongoose;

const notificationSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['expression_of_interest', 'expression_accepted', 'expression_rejected', 'new_message', 'profile_verified', 'project_in_progress', 'new_review'],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);

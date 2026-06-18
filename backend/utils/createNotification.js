const Notification = require('../models/Notification');
const { getIO } = require('./socketIo');

const createNotification = async (userId, type, title, message, link) => {
  try {
    await Notification.create({ userId, type, title, message, link });
    const io = getIO();
    if (io) {
      const count = await Notification.countDocuments({ userId, read: false });
      io.to(userId.toString()).emit('new_notification', { count });
    }
  } catch (error) {
    console.error('Notification creation failed:', error);
  }
};

module.exports = createNotification;

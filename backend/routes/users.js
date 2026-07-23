const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Rating = require('../models/Rating');
const Expression = require('../models/Expression');
const ExpressionOfInterest = require('../models/ExpressionOfInterest');
const Project = require('../models/Project');
const Professional = require('../models/Professional');
const cloudinary = require('../config/cloudinary');
const auth = require('../middleware/auth');

function extractPublicId(url) {
  try {
    const uploadIdx = url.indexOf('/upload/');
    if (uploadIdx === -1) return null;
    let path = url.substring(uploadIdx + 8);
    path = path.replace(/^v\d+\//, '');
    path = path.replace(/\.[^/.]+$/, '');
    return path;
  } catch {
    return null;
  }
}

// GET /api/users/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/users/settings
router.put('/settings', auth, async (req, res) => {
  try {
    const { fullName, phone, location } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { fullName, phone, location },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating settings' });
  }
});

// PUT /api/users/change-password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All password fields are required' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating password' });
  }
});

// DELETE /api/users/account — requires password confirmation, cascade deletes all user data
router.delete('/account', auth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be deleted this way' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password. Account not deleted.' });
    }

    const userId = user._id;

    // Clean up Cloudinary images
    const professional = await Professional.findOne({ userId });
    const imagesToDelete = [];
    if (user.profilePicture) imagesToDelete.push(user.profilePicture);
    if (professional?.profilePicture) imagesToDelete.push(professional.profilePicture);
    if (professional?.portfolioImages?.length) imagesToDelete.push(...professional.portfolioImages);

    for (const url of imagesToDelete) {
      const publicId = extractPublicId(url);
      if (publicId) {
        cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    // Cascade delete
    const clientProjectIds = await Project.find({ clientId: userId }).distinct('_id');
    await Promise.all([
      Notification.deleteMany({ userId }),
      Message.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] }),
      Conversation.deleteMany({ participants: userId }),
      Rating.deleteMany({ $or: [{ clientId: userId }, { professionalId: userId }] }),
      Expression.deleteMany({ $or: [{ professionalId: userId }, { projectId: { $in: clientProjectIds } }] }),
      ExpressionOfInterest.deleteMany({ $or: [{ clientId: userId }, { professionalId: userId }] }),
    ]);
    await Project.deleteMany({ clientId: userId });
    if (professional) await professional.deleteOne();
    await user.deleteOne();

    res.json({ message: 'Account successfully deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting account' });
  }
});

module.exports = router;

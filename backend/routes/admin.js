const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

router.use(auth, requireAdmin);

// GET /api/admin/analytics
router.get('/analytics', async (req, res) => {
  try {
    const [
      totalUsers,
      totalProfessionals,
      totalClients,
      verifiedProfessionals,
      pendingVerifications,
      totalProjects,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'professional' }),
      User.countDocuments({ role: 'client' }),
      User.countDocuments({ role: 'professional', isVerified: true }),
      User.countDocuments({ role: 'professional', isVerified: false }),
      Project.countDocuments(),
    ]);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const registrationsPerDay = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      const count = await User.countDocuments({ createdAt: { $gte: start, $lte: end } });
      registrationsPerDay.push({ day: days[start.getDay()], count });
    }

    res.json({
      totalUsers,
      totalProfessionals,
      totalClients,
      totalProjects,
      verifiedProfessionals,
      pendingVerifications,
      registrationsPerDay,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});

// GET /api/admin/pending
router.get('/pending', async (req, res) => {
  try {
    const pending = await User.find(
      { role: 'professional', isVerified: false },
      { password: 0 }
    ).sort({ createdAt: -1 });
    res.json(pending);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching pending verifications' });
  }
});

// GET /api/admin/users — all users with optional ?role= filter
router.get('/users', async (req, res) => {
  try {
    const filter = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(filter, { password: 0 }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// GET /api/admin/users/:id
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin user' });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

// GET /api/admin/projects — all projects with client details
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('clientId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
});

// DELETE /api/admin/projects/:id
router.delete('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting project' });
  }
});

// PUT /api/admin/verify/:id
router.put('/verify/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { returnDocument: 'after', select: '-password' }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Professional verified successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error verifying professional' });
  }
});

// DELETE /api/admin/reject/:id
router.delete('/reject/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Professional rejected and removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error rejecting professional' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Middleware: require admin role on every admin route
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
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'professional' }),
      User.countDocuments({ role: 'client' }),
      User.countDocuments({ role: 'professional', isVerified: true }),
      User.countDocuments({ role: 'professional', isVerified: false }),
    ]);

    // Last 7 days of registrations
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
      totalProjects: 0,
      verifiedProfessionals,
      pendingVerifications,
      registrationsPerDay,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});

// GET /api/admin/pending — professionals with isVerified: false
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

// PUT /api/admin/verify/:id — approve a professional
router.put('/verify/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true, select: '-password' }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Professional verified successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error verifying professional' });
  }
});

// DELETE /api/admin/reject/:id — remove a professional
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

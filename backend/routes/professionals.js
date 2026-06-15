const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Professional = require('../models/Professional');
const auth = require('../middleware/auth');

function mergeProfile(user, profile) {
  return {
    _id: user._id,
    userId: user,
    specialty: profile?.specialty || null,
    bio: profile?.bio || null,
    location: profile?.location || null,
    profilePicture: profile?.profilePicture || null,
    portfolioImages: profile?.portfolioImages || [],
    averageRating: profile?.averageRating || 0,
    totalReviews: profile?.totalReviews || 0,
  };
}

// GET /api/professionals — all verified professionals
router.get('/', auth, async (req, res) => {
  try {
    const { specialty, location } = req.query;

    const users = await User.find(
      { role: 'professional', isVerified: true },
      { password: 0 }
    ).sort({ createdAt: -1 });

    const results = await Promise.all(
      users.map(async (user) => {
        const profile = await Professional.findOne({ userId: user._id });
        return mergeProfile(user, profile);
      })
    );

    const filtered = results.filter(r => {
      if (specialty && r.specialty !== specialty) return false;
      if (location && !r.location?.toLowerCase().includes(location.toLowerCase())) return false;
      return true;
    });

    res.json(filtered);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching professionals' });
  }
});

// PUT /api/professionals/profile — professional updates their own profile
// Defined before GET /:id to avoid "profile" being treated as an ID
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'professional') {
      return res.status(403).json({ message: 'Only professionals can update a profile' });
    }
    const { specialty, bio, location } = req.body;
    const profile = await Professional.findOneAndUpdate(
      { userId: req.user.userId },
      { specialty, bio, location },
      { upsert: true, new: true }
    );
    const user = await User.findById(req.user.userId, { password: 0 });
    res.json(mergeProfile(user, profile));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// GET /api/professionals/:id — single professional by user ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 });
    if (!user || user.role !== 'professional') {
      return res.status(404).json({ message: 'Professional not found' });
    }
    const profile = await Professional.findOne({ userId: user._id });
    res.json(mergeProfile(user, profile));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching professional' });
  }
});

module.exports = router;

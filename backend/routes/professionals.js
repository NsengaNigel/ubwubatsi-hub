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
    profilePicture: user.profilePicture || profile?.profilePicture || null,
    portfolioImages: profile?.portfolioImages || [],
    certifications: profile?.certifications || [],
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
      'fullName email profilePicture isVerified createdAt'
    ).sort({ createdAt: -1 });
    const results = await Promise.all(
      users.map(async (user) => {
        const profile = await Professional.findOne({ userId: user._id })
          .select('specialty bio location profilePicture portfolioImages certifications averageRating totalReviews');
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

// PUT /api/professionals/profile — update own professional details
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

// GET /api/professionals/my-profile — own profile (must be before /:id)
router.get('/my-profile', auth, async (req, res) => {
  try {
    if (req.user.role !== 'professional') {
      return res.status(403).json({ message: 'Only professionals can access this' });
    }
    const user = await User.findById(req.user.userId, { password: 0 });
    if (!user) return res.status(404).json({ message: 'Not found' });
    const profile = await Professional.findOne({ userId: user._id });
    res.json(mergeProfile(user, profile));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/professionals/certifications — add a certification
router.put('/certifications', auth, async (req, res) => {
  try {
    if (req.user.role !== 'professional') {
      return res.status(403).json({ message: 'Only professionals can manage certifications' });
    }
    const { name, issuingBody, year } = req.body;
    if (!name) return res.status(400).json({ message: 'Certification name is required' });

    const profile = await Professional.findOneAndUpdate(
      { userId: req.user.userId },
      { $push: { certifications: { name, issuingBody, year } } },
      { upsert: true, new: true }
    );
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding certification' });
  }
});

// DELETE /api/professionals/certifications/:id — remove a certification
router.delete('/certifications/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'professional') {
      return res.status(403).json({ message: 'Only professionals can manage certifications' });
    }
    const profile = await Professional.findOneAndUpdate(
      { userId: req.user.userId },
      { $pull: { certifications: { _id: req.params.id } } },
      { new: true }
    );
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting certification' });
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

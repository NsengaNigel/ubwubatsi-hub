const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');
const Professional = require('../models/Professional');
const auth = require('../middleware/auth');

function userShape(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isVerified: user.isVerified,
    registrationNumber: user.registrationNumber,
    profilePicture: user.profilePicture,
    location: user.location,
  };
}

// GET /api/auth/stats — public, no auth required
router.get('/stats', async (req, res) => {
  try {
    const [totalProfessionals, totalClients, totalProjects] = await Promise.all([
      User.countDocuments({ role: 'professional', isVerified: true }),
      User.countDocuments({ role: 'client' }),
      Project.countDocuments(),
    ]);
    res.json({ totalProfessionals, totalClients, totalProjects });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password, role, registrationNumber, specialty } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const rwandaPhoneRegex = /^(\+250|0)7[2389]\d{7}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regNumberRegex = /^([A-Z]\d+\/[A-Z]{2}\/[A-Z]{2,4}\/\d{4}|RIA-\d{4}-\d{3})$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Enter a valid email address' });
    }

    if (!rwandaPhoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Enter a valid Rwandan phone number' });
    }

    if (role === 'professional' && !registrationNumber) {
      return res.status(400).json({ message: 'Registration number is required for professionals' });
    }

    if (role === 'professional' && registrationNumber && !regNumberRegex.test(registrationNumber)) {
      return res.status(400).json({ message: 'Enter a valid registration number e.g. A2121/EC/IER/2024 or RIA-2024-001' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
      registrationNumber: registrationNumber || null,
      isVerified: false,
    });

    await user.save();

    if (role === 'professional') {
      await Professional.create({ userId: user._id, specialty: specialty || null });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ message: 'User registered successfully', token, user: userShape(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Login successful', token, user: userShape(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// GET /api/auth/me — returns fresh user data from DB
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(userShape(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' });
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

module.exports = router;

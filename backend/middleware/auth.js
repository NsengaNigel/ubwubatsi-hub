const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = {
      userId: user._id.toString(),
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      isVerified: user.isVerified,
      profilePicture: user.profilePicture,
      location: user.location,
    };
    next();
  } catch {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ message: 'Account pending verification' });
  }
  next();
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: insufficient role' });
  }
  next();
};

module.exports = auth;
module.exports.requireVerified = requireVerified;
module.exports.requireRole = requireRole;

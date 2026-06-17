const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Professional = require('../models/Professional');
const User = require('../models/User');
const auth = require('../middleware/auth');

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and WebP images are allowed'));
    }
  },
});

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

function getPublicId(url) {
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const afterUpload = parts[1].replace(/^v\d+\//, '');
  return afterUpload.replace(/\.[^/.]+$/, '');
}

// POST /api/upload/profile-picture — all roles
router.post('/profile-picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });

    const result = await uploadToCloudinary(req.file.buffer, 'ubwubatsi/profiles');
    await User.findByIdAndUpdate(req.user.userId, { profilePicture: result.secure_url });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
    const msg = error.message?.includes('Only JPG') ? error.message : 'Failed to upload profile picture';
    res.status(400).json({ message: msg });
  }
});

// POST /api/upload/portfolio — professionals only
router.post('/portfolio', auth, upload.array('portfolioImages', 5), async (req, res) => {
  try {
    if (req.user.role !== 'professional') {
      return res.status(403).json({ message: 'Only professionals can upload portfolio images' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const existing = await Professional.findOne({ userId: req.user.userId });
    const currentCount = existing?.portfolioImages?.length || 0;
    if (currentCount + req.files.length > 5) {
      return res.status(400).json({
        message: `Adding ${req.files.length} image(s) would exceed the 5-image limit (currently have ${currentCount})`,
      });
    }

    const uploads = await Promise.all(
      req.files.map(file => uploadToCloudinary(file.buffer, 'ubwubatsi/portfolio'))
    );
    const urls = uploads.map(r => r.secure_url);

    const updated = await Professional.findOneAndUpdate(
      { userId: req.user.userId },
      { $push: { portfolioImages: { $each: urls } } },
      { upsert: true, new: true }
    );

    res.json({ urls, portfolioImages: updated.portfolioImages });
  } catch (error) {
    console.error(error);
    const msg = error.message?.includes('Only JPG') ? error.message : 'Failed to upload portfolio images';
    res.status(400).json({ message: msg });
  }
});

// DELETE /api/upload/portfolio — professionals only
router.delete('/portfolio', auth, async (req, res) => {
  try {
    if (req.user.role !== 'professional') {
      return res.status(403).json({ message: 'Only professionals can delete portfolio images' });
    }

    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ message: 'imageUrl is required' });

    const publicId = getPublicId(imageUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    const updated = await Professional.findOneAndUpdate(
      { userId: req.user.userId },
      { $pull: { portfolioImages: imageUrl } },
      { new: true }
    );

    res.json({ message: 'Image deleted', portfolioImages: updated?.portfolioImages || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete portfolio image' });
  }
});

// DELETE /api/upload/profile-picture — all roles
router.delete('/profile-picture', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.profilePicture) {
      const publicId = getPublicId(user.profilePicture);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await User.findByIdAndUpdate(req.user.userId, { profilePicture: null });
    res.json({ message: 'Profile picture removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete profile picture' });
  }
});

module.exports = router;

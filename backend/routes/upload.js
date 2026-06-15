const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Professional = require('../models/Professional');
const auth = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

// Wraps cloudinary upload_stream in a Promise so we can await it
function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// POST /api/upload/profile-picture
router.post('/profile-picture', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });

    const result = await uploadToCloudinary(req.file.buffer, 'ubwubatsi/profiles');

    await Professional.findOneAndUpdate(
      { userId: req.user.userId },
      { profilePicture: result.secure_url },
      { upsert: true, new: true }
    );

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload profile picture' });
  }
});

// POST /api/upload/portfolio — up to 5 images
router.post('/portfolio', auth, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const uploads = await Promise.all(
      req.files.map(file => uploadToCloudinary(file.buffer, 'ubwubatsi/portfolio'))
    );

    const urls = uploads.map(r => r.secure_url);

    await Professional.findOneAndUpdate(
      { userId: req.user.userId },
      { $push: { portfolioImages: { $each: urls } } },
      { upsert: true, new: true }
    );

    res.json({ urls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload portfolio images' });
  }
});

module.exports = router;

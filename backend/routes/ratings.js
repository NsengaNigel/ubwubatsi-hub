const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Project = require('../models/Project');
const ExpressionOfInterest = require('../models/ExpressionOfInterest');
const auth = require('../middleware/auth');
const createNotification = require('../utils/createNotification');
const recalculateRating = require('../utils/recalculateRating');

// GET /api/ratings/professional/:id — public; :id is the professional's User._id
router.get('/professional/:id', async (req, res) => {
  try {
    const ratings = await Rating.find({ professionalId: req.params.id })
      .populate('clientId', 'fullName profilePicture')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/ratings/project/:projectId — protected; client's rating for a specific project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const rating = await Rating.findOne({
      projectId: req.params.projectId,
      clientId: req.user.userId,
    });
    res.json(rating || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/ratings/can-rate/:projectId — client checks if they can rate
router.get('/can-rate/:projectId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') return res.json({ canRate: false });

    const project = await Project.findById(req.params.projectId);
    if (!project || project.status !== 'completed') return res.json({ canRate: false });
    if (project.clientId.toString() !== req.user.userId) return res.json({ canRate: false });

    const existing = await Rating.findOne({
      projectId: req.params.projectId,
      clientId: req.user.userId,
    });
    if (existing) return res.json({ canRate: false, alreadyRated: true });

    const accepted = await ExpressionOfInterest.findOne({
      projectId: req.params.projectId,
      clientId: req.user.userId,
      status: 'accepted',
    });
    if (!accepted) return res.json({ canRate: false });

    res.json({ canRate: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/ratings — client submits a rating
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can submit ratings' });
    }
    const { projectId, score, review } = req.body;
    if (!projectId || !score) return res.status(400).json({ message: 'projectId and score are required' });
    if (score < 1 || score > 5) return res.status(400).json({ message: 'Score must be between 1 and 5' });

    const project = await Project.findById(projectId);
    if (!project || project.status !== 'completed') {
      return res.status(400).json({ message: 'Project is not completed' });
    }
    if (project.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const accepted = await ExpressionOfInterest.findOne({
      projectId,
      clientId: req.user.userId,
      status: 'accepted',
    });
    if (!accepted) return res.status(400).json({ message: 'No accepted professional found for this project' });

    const rating = await Rating.create({
      projectId,
      clientId: req.user.userId,
      professionalId: accepted.professionalId,
      score,
      review: review || '',
    });

    await recalculateRating(accepted.professionalId);

    const scoreLabels = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
    await createNotification(
      accepted.professionalId,
      'new_review',
      'New Review Received',
      `${req.user.fullName} rated your work on "${project.title}" — ${score}/5 (${scoreLabels[score]})`,
      '/professional-dashboard'
    );

    const populated = await rating.populate('clientId', 'fullName profilePicture');
    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already rated this project' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

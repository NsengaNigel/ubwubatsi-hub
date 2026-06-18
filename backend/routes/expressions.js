const express = require('express');
const router = express.Router();
const ExpressionOfInterest = require('../models/ExpressionOfInterest');
const Project = require('../models/Project');
const Professional = require('../models/Professional');
const auth = require('../middleware/auth');
const createNotification = require('../utils/createNotification');

// GET /api/expressions/professional — all expressions for the logged-in professional
router.get('/professional', auth, async (req, res) => {
  try {
    if (req.user.role !== 'professional') return res.status(403).json({ message: 'Access denied' });
    const expressions = await ExpressionOfInterest.find({ professionalId: req.user.userId })
      .populate({
        path: 'projectId',
        select: 'title location budget category clientId status',
        populate: { path: 'clientId', select: 'fullName email' },
      })
      .sort({ createdAt: -1 });
    res.json(expressions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/expressions/client — all expressions across all client's projects (for notification count)
router.get('/client', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') return res.status(403).json({ message: 'Access denied' });
    const projects = await Project.find({ clientId: req.user.userId }, { _id: 1 });
    const projectIds = projects.map(p => p._id);
    const expressions = await ExpressionOfInterest.find({ projectId: { $in: projectIds } })
      .populate('projectId', 'title location status')
      .populate('professionalId', 'fullName email isVerified')
      .sort({ createdAt: -1 });
    res.json(expressions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/expressions/project/:projectId — expressions for a project (client owns it)
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (req.user.role === 'client' && project.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const expressions = await ExpressionOfInterest.find({ projectId: req.params.projectId })
      .populate('professionalId', 'fullName email isVerified profilePicture')
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(
      expressions.map(async (expr) => {
        const prof = await Professional.findOne({ userId: expr.professionalId._id })
          .select('specialty averageRating bio');
        return {
          ...expr.toObject(),
          professionalProfile: prof
            ? { specialty: prof.specialty, averageRating: prof.averageRating, bio: prof.bio }
            : null,
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/expressions — professional expresses interest in a project
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'professional') {
      return res.status(403).json({ message: 'Only professionals can express interest' });
    }
    const { projectId, message } = req.body;
    if (!projectId) return res.status(400).json({ message: 'projectId is required' });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const expression = new ExpressionOfInterest({
      projectId,
      professionalId: req.user.userId,
      clientId: project.clientId,
      message: message || '',
    });
    await expression.save();

    const populated = await expression.populate('projectId', 'title location budget category');

    await createNotification(
      project.clientId,
      'expression_of_interest',
      'New Interest in Your Project',
      `${req.user.fullName} has expressed interest in your project "${project.title}"`,
      '/client-dashboard'
    );

    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already expressed interest in this project' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/expressions/:id/accept — client accepts; auto-rejects others; project goes in-progress
router.put('/:id/accept', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') return res.status(403).json({ message: 'Access denied' });

    const expression = await ExpressionOfInterest.findById(req.params.id);
    if (!expression) return res.status(404).json({ message: 'Expression not found' });

    const project = await Project.findById(expression.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    expression.status = 'accepted';
    await expression.save();

    await ExpressionOfInterest.updateMany(
      { projectId: expression.projectId, _id: { $ne: expression._id }, status: 'pending' },
      { status: 'rejected' }
    );

    project.status = 'in-progress';
    await project.save();

    await createNotification(
      expression.professionalId,
      'expression_accepted',
      'Your Interest Was Accepted',
      `${req.user.fullName} has accepted your interest in "${project.title}". You can now message them.`,
      '/professional-dashboard'
    );

    res.json(expression);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/expressions/:id/reject — client rejects one expression
router.put('/:id/reject', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') return res.status(403).json({ message: 'Access denied' });

    const expression = await ExpressionOfInterest.findById(req.params.id);
    if (!expression) return res.status(404).json({ message: 'Expression not found' });

    const project = await Project.findById(expression.projectId);
    if (!project || project.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    expression.status = 'rejected';
    await expression.save();

    await createNotification(
      expression.professionalId,
      'expression_rejected',
      'Your Interest Was Not Accepted',
      `${req.user.fullName} has reviewed your interest in "${project.title}"`,
      '/professional-dashboard'
    );

    res.json(expression);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/expressions/:id — professional withdraws (pending only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'professional') return res.status(403).json({ message: 'Access denied' });

    const expression = await ExpressionOfInterest.findById(req.params.id);
    if (!expression) return res.status(404).json({ message: 'Expression not found' });
    if (expression.professionalId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (expression.status !== 'pending') {
      return res.status(400).json({ message: 'Can only withdraw pending expressions' });
    }

    await expression.deleteOne();
    res.json({ message: 'Expression withdrawn' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

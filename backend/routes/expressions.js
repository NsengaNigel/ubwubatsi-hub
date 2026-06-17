const express = require('express');
const router = express.Router();
const Expression = require('../models/Expression');
const auth = require('../middleware/auth');

// POST /api/expressions — professional expresses interest in a project
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'professional') {
      return res.status(403).json({ message: 'Only professionals can express interest' });
    }
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ message: 'projectId is required' });

    const expression = new Expression({
      projectId,
      professionalId: req.user.userId,
    });
    await expression.save();

    const populated = await expression.populate('projectId', 'title location budget category clientId');
    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already expressed interest in this project' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/expressions/professional — all expressions for the logged-in professional
router.get('/professional', auth, async (req, res) => {
  try {
    if (req.user.role !== 'professional') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const expressions = await Expression.find({ professionalId: req.user.userId })
      .populate({
        path: 'projectId',
        select: 'title location budget category clientId',
        populate: { path: 'clientId', select: 'fullName email' },
      })
      .sort({ createdAt: -1 });
    res.json(expressions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/expressions/project/:projectId — expressions for a project (clients/admin)
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const expressions = await Expression.find({ projectId: req.params.projectId })
      .populate('professionalId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(expressions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/expressions/:id — client accepts or rejects
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'status must be accepted or rejected' });
    }
    const expression = await Expression.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!expression) return res.status(404).json({ message: 'Expression not found' });
    res.json(expression);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

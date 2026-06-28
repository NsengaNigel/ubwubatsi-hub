const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const ExpressionOfInterest = require('../models/ExpressionOfInterest');
const Professional = require('../models/Professional');
const auth = require('../middleware/auth');
const createNotification = require('../utils/createNotification');

// POST /api/projects — client posts a new project
router.post('/', auth, async (req, res) => {
  try {
    const { title, category, location, budget, description, preferredProfessionalId } = req.body;
    const kubakaLink = `https://kubaka.gov.rw/search?location=${encodeURIComponent(location)}`;

    const project = new Project({
      title,
      category,
      location,
      budget,
      description,
      clientId: req.user.userId,
      kubakaLink,
    });

    await project.save();

    if (preferredProfessionalId) {
      try {
        await ExpressionOfInterest.create({
          projectId: project._id,
          professionalId: preferredProfessionalId,
          clientId: req.user.userId,
          message: 'Client requested this professional directly',
        });
      } catch {
        // ignore duplicate or invalid id — project still created
      }
    }

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating project' });
  }
});

// GET /api/projects/my-projects — projects posted by the logged-in client with expression counts + accepted professional
// Static routes must be BEFORE /:id
router.get('/my-projects', auth, async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.user.userId }).sort({ createdAt: -1 });
    const withData = await Promise.all(
      projects.map(async (proj) => {
        const expressionCount = await ExpressionOfInterest.countDocuments({
          projectId: proj._id,
          status: 'pending',
        });

        let acceptedProfessional = null;
        if (proj.status === 'in-progress' || proj.status === 'completed') {
          const accepted = await ExpressionOfInterest.findOne({
            projectId: proj._id,
            status: 'accepted',
          }).populate('professionalId', 'fullName profilePicture isVerified');

          if (accepted && accepted.professionalId) {
            const profDoc = await Professional.findOne({ userId: accepted.professionalId._id })
              .select('specialty averageRating totalReviews');
            acceptedProfessional = {
              userId: accepted.professionalId._id,
              fullName: accepted.professionalId.fullName,
              profilePicture: accepted.professionalId.profilePicture,
              isVerified: accepted.professionalId.isVerified,
              specialty: profDoc?.specialty || null,
              averageRating: profDoc?.averageRating || 0,
              totalReviews: profDoc?.totalReviews || 0,
              expressionId: accepted._id,
            };
          }
        }

        return { ...proj.toObject(), expressionCount, acceptedProfessional };
      })
    );
    res.json(withData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching your projects' });
  }
});

// GET /api/projects/active/:professionalId — projects with accepted expressions
// Static prefix "active" must be before /:id
router.get('/active/:professionalId', auth, async (req, res) => {
  try {
    const expressions = await ExpressionOfInterest.find({
      professionalId: req.params.professionalId,
      status: 'accepted',
    });
    const projectIds = expressions.map(e => e.projectId);
    const projects = await Project.find({ _id: { $in: projectIds } })
      .populate('clientId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching active projects' });
  }
});

// GET /api/projects — all projects (professionals browse)
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find()
      .select('title category location budget description clientId kubakaLink status createdAt')
      .populate('clientId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
});

// GET /api/projects/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching project' });
  }
});

// PUT /api/projects/:id/complete — client marks project complete (must be before /:id)
router.put('/:id/complete', auth, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can mark projects as complete' });
    }
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (project.status !== 'in-progress') {
      return res.status(400).json({ message: 'Only in-progress projects can be marked complete' });
    }

    project.status = 'completed';
    await project.save();

    const accepted = await ExpressionOfInterest.findOne({ projectId: project._id, status: 'accepted' });
    if (accepted) {
      await createNotification(
        accepted.professionalId,
        'project_in_progress',
        'Project Marked Complete',
        `${req.user.fullName} has marked "${project.title}" as completed. You can now receive a review.`,
        '/professional-dashboard'
      );
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/projects/:id — client updates their own project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this project' });
    }

    const { title, category, location, budget, description } = req.body;
    project.title = title ?? project.title;
    project.category = category ?? project.category;
    project.budget = budget ?? project.budget;
    project.description = description ?? project.description;

    if (location && location !== project.location) {
      project.location = location;
      project.kubakaLink = `https://kubaka.gov.rw/search?location=${encodeURIComponent(location)}`;
    }

    await project.save();
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating project' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting project' });
  }
});

module.exports = router;

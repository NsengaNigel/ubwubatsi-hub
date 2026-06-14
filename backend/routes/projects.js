const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// POST /api/projects — client posts a new project
router.post('/', auth, async (req, res) => {
  try {
    const { title, category, location, budget, description } = req.body;
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
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating project' });
  }
});

// GET /api/projects/my-projects — projects posted by the logged-in client
// Defined BEFORE /:id so Express does not treat "my-projects" as an id
router.get('/my-projects', auth, async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.user.userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching your projects' });
  }
});

// GET /api/projects — all projects (for professionals to browse)
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('clientId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
});

// GET /api/projects/:id — single project by ID
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

// DELETE /api/projects/:id — client deletes their own project
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

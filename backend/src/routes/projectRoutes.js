import express from 'express';
import {
  getAllProjects,
  getProjectBySlug,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  togglePublish,
  toggleFeatured,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProjects);
router.get('/:slug', getProjectBySlug);

// Protected admin routes
router.get('/admin/all', protect, getAdminProjects);
router.post('/admin', protect, createProject);
router.put('/admin/:id', protect, updateProject);
router.delete('/admin/:id', protect, deleteProject);
router.patch('/admin/:id/toggle-publish', protect, togglePublish);
router.patch('/admin/:id/toggle-featured', protect, toggleFeatured);

export default router;
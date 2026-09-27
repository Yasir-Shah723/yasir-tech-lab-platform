import express from 'express';
import {
  getAllTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialPublish,
} from '../controllers/testimonialController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route
router.get('/', getAllTestimonials);

// Protected admin routes
router.get('/admin/all', protect, getAdminTestimonials);
router.post('/admin', protect, createTestimonial);
router.put('/admin/:id', protect, updateTestimonial);
router.delete('/admin/:id', protect, deleteTestimonial);
router.patch('/admin/:id/toggle-publish', protect, toggleTestimonialPublish);

export default router;
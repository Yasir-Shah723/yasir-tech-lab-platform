import express from 'express';
import {
  getAllBlogs,
  getBlogBySlug,
  getAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogPublish,
} from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

// Admin routes
router.get('/admin/all', protect, getAdminBlogs);
router.post('/admin', protect, createBlog);
router.put('/admin/:id', protect, updateBlog);
router.delete('/admin/:id', protect, deleteBlog);
router.patch('/admin/:id/toggle-publish', protect, toggleBlogPublish);

export default router;
import express from 'express';
import {
  login,
  getMe,
  updatePassword,
  getAdminStats,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth route
router.post('/login', login);

// Protected auth routes
router.get('/me', protect, getMe);
router.patch('/update-password', protect, updatePassword);
router.get('/admin/stats', protect, getAdminStats);

export default router;
import express from 'express';
import {
  login,
  forgotPassword,
  resetPassword,
  getAdminStats,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Live metrics route for admin dashboard
router.get('/admin/stats', protect, getAdminStats);

export default router;
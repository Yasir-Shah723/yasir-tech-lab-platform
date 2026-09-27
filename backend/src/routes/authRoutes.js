import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, getMe, updatePassword, getAdminStats } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rate limiter for authentication: 5 failed attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    status: 'fail',
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
});

router.post('/login', loginLimiter, login);
router.get('/me', protect, getMe);
router.get('/admin/stats', protect, getAdminStats);

export default router;
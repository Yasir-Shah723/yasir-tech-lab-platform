import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  submitMessage,
  getAdminMessages,
  updateMessageStatus,
  deleteMessage,
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Strict rate limiter on contact submission: max 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many messages sent from this IP. Please wait 15 minutes before sending another inquiry.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public submission endpoint
router.post('/', contactLimiter, submitMessage);

// Protected admin endpoints
router.get('/admin/all', protect, getAdminMessages);
router.patch('/admin/:id/status', protect, updateMessageStatus);
router.delete('/admin/:id', protect, deleteMessage);

export default router;